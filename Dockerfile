ARG PHP_BASE_IMAGE=php:8.4-cli-alpine
ARG NODE_BASE_IMAGE=node:22-alpine
ARG COMPOSER_BASE_IMAGE=composer:latest

FROM ${PHP_BASE_IMAGE} AS php-build

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist


# Base Node Image
FROM ${NODE_BASE_IMAGE} AS node-build

WORKDIR /app

COPY --from=php-build --chown=www-data:www-data /var/www/html/vendor ./vendor

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Base PHP Image
FROM ${PHP_BASE_IMAGE} AS production

LABEL org.opencontainers.image.source=https://github.com/mayocca/petrohaus
LABEL org.opencontainers.image.description="Petrohaus is a web application for searching the best gas prices in Argentina"
LABEL org.opencontainers.image.license=CC-BY-NC-ND-4.0

WORKDIR /var/www/html

# --* install build dependencies *--
COPY --from=ghcr.io/mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
    pcntl \
    swoole

# --* install composer *--
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --* set recommended php.ini *--
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

USER www-data

# --* copy vendor from php-build *--
COPY --from=php-build --chown=www-data:www-data /var/www/html/vendor ./vendor

# --* copy source code *--
COPY --chown=www-data:www-data . .

# --* copy build assets *--
COPY --from=node-build --chown=www-data:www-data /app/public/build ./public/build

# --* set permissions *--
RUN mkdir -p storage bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

# --* optimize *--
RUN composer dump-autoload --optimize

# --* expose default port *--
EXPOSE 8080

# --* start octane *--
CMD ["php", "artisan", "octane:start", "--host=0.0.0.0", "--port=8080"]