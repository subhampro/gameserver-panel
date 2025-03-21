#!/bin/bash

# Set NODE_OPTIONS to allow legacy OpenSSL algorithms
export NODE_OPTIONS=--openssl-legacy-provider

# Run yarn commands with OpenSSL legacy provider enabled
cd /var/www/pterodactyl
yarn build:production

# Fix permissions
chown -R www-data:www-data /var/www/pterodactyl/public/assets/*

# Clear cache
php artisan view:clear
php artisan cache:clear

echo "Theme rebuild complete!" 