ARG PHP_BASE_IMAGE=serversideup/php:8.4-fpm-nginx
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

ENV AUTORUN_ENABLED=true
ENV AUTORUN_LARAVEL_MIGRATION_ISOLATION=true

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist

COPY --chown=www-data:www-data . .

COPY --from=node-build --chown=www-data:www-data /var/www/html/public/build ./public/build

RUN chown -R www-data:www-data storage bootstrap/cache

RUN composer dump-autoload --optimize
