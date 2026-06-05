FROM php:8.5.7-fpm

# System dependencies (libpq for PostgreSQL) and tools to add the nginx repo
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        libpq-dev \
        libzip-dev \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Official nginx repository (for nginx 1.30)
RUN curl -fsSL https://nginx.org/keys/nginx_signing.key | gpg --dearmor -o /usr/share/keyrings/nginx.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/nginx.gpg] https://nginx.org/packages/debian $(. /etc/os-release && echo $VERSION_CODENAME) nginx" \
        > /etc/apt/sources.list.d/nginx.list

# Install nginx 1.30 from the official repository
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx=1.30.* \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions (PostgreSQL + zip)
RUN docker-php-ext-install pdo_pgsql pgsql zip

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# nginx vhost configuration (serves public/ and proxies to php-fpm)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/flowgenius

# Copy the whole project root into the image (the docker/ folder is excluded via .dockerignore)
COPY . /var/www/flowgenius

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader

EXPOSE 80

RUN echo 'PS1="\[\e[32m\][\[\e[m\]\[\e[31m\]\u\[\e[m\]\[\e[33m\]@\[\e[m\]\[\e[32m\]\h\[\e[m\]:\[\e[36m\]\w\[\e[m\]\[\e[32m\]]\[\e[m\]\[\e[32;47m\]\\$\[\e[m\] "' >> /root/.bashrc

# Run php-fpm in the background and nginx in the foreground
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
