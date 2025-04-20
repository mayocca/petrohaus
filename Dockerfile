ARG PHP_BASE_IMAGE=php:8.4-cli-alpine
ARG NODE_BASE_IMAGE=node:22-alpine

# Base Node Image
FROM ${NODE_BASE_IMAGE} AS node-build

WORKDIR /var/www/html

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Base PHP Image
FROM ${PHP_BASE_IMAGE} AS php-build

COPY --from=ghcr.io/mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
    intl \
    pcntl \
    swoole \
    zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

USER www-data

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist

COPY --chown=www-data:www-data . .

COPY --from=node-build /var/www/html/public/build ./public/build

RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--host=0.0.0.0", "--port=8000"]
