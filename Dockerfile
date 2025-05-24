ARG PHP_BASE_IMAGE=php:8.4-cli-alpine
ARG NODE_BASE_IMAGE=node:22-alpine

# Base Node Image
FROM ${NODE_BASE_IMAGE} AS node-build

WORKDIR /var/www/html

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

USER www-data

# --* install dependencies *--
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist

# --* copy source code *--
COPY --chown=www-data:www-data . .

# --* copy build assets *--
COPY --from=node-build --chown=www-data:www-data /var/www/html/public/build ./public/build

# --* set permissions *--
RUN mkdir -p storage bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

# --* optimize *--
RUN composer dump-autoload --optimize

# --* expose default port *--
EXPOSE 8080

# --* start octane *--
CMD ["php", "artisan", "octane:start", "--host=0.0.0.0", "--port=8080"]