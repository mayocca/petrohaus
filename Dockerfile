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

USER root

RUN apk add --no-cache --virtual .build-deps \
    autoconf \
    brotli-dev \
    g++ \
    icu-dev \
    make \
    libtool \
    libzip \
    linux-headers \
    openssl-dev \
    && pecl install swoole \
    && docker-php-ext-enable \
    swoole \
    && docker-php-ext-install \
    intl \
    zip \
    && apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

USER www-data

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist

COPY . .

COPY --from=node-build /var/www/html/public/build ./public/build

RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "artisan", "octane:start"]
