ARG PHP_BASE_IMAGE=php:8.4-fpm-alpine
ARG NODE_BASE_IMAGE=node:22-alpine

# Base Node Image
FROM ${NODE_BASE_IMAGE} AS node-build

WORKDIR /var/www/html

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Base PHP Image
FROM ${PHP_BASE_IMAGE} AS php-base

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --from=ghcr.io/mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
    intl \
    pcntl \
    zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

USER www-data

COPY package.json package-lock.json ./

RUN npm ci

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist

COPY --chown=www-data:www-data . .

COPY --from=node-build /var/www/html/public/build ./public/build

RUN composer dump-autoload --optimize
