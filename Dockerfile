ARG BASE_IMAGE=php:8.4-cli-alpine

FROM ${BASE_IMAGE} AS base

USER root

RUN apk add --no-cache --virtual .build-deps \
    autoconf \
    brotli-dev \
    g++ \
    make \
    libtool \
    linux-headers \
    openssl-dev \
    && pecl install swoole \
    && docker-php-ext-enable swoole \
    && apk del .build-deps

USER www-data

EXPOSE 8000

CMD ["php", "artisan", "octane:start"]
