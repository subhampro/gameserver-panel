#!/bin/bash

# Set NODE_OPTIONS to allow legacy OpenSSL algorithms
export NODE_OPTIONS=--openssl-legacy-provider

echo "Node.js build process shuru kar raha hoon..."
echo "LoginFormContainer.tsx mein kiye gaye changes compile ho rahe hain..."

# Run yarn commands with OpenSSL legacy provider enabled
cd /var/www/pterodactyl
yarn install
yarn run build:production

# Fix permissions
echo "File permissions fix kar raha hoon..."
chown -R www-data:www-data /var/www/pterodactyl/public/assets/*

# Clear cache
echo "Cache clear kar raha hoon..."
php artisan view:clear
php artisan cache:clear

echo "Build process complete ho gaya hai!"
echo "Aapke TypeScript file ke changes ab apply ho gaye hain." 