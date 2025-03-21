#!/bin/bash

# Put the application in maintenance mode
echo "Panel ko maintenance mode mein daal raha hoon..."
php artisan down

# Install composer dependencies
echo "Composer dependencies install kar raha hoon..."
composer install --no-dev --optimize-autoloader

# Clear cached views, config
echo "Cache clear kar raha hoon..."
php artisan view:clear
php artisan config:clear

# Run migrations
echo "Database migrations run kar raha hoon..."
php artisan migrate --seed --force

# Fix permissions
echo "File permissions fix kar raha hoon..."
chown -R www-data:www-data /var/www/pterodactyl/*

# Restart queue workers
echo "Queue restart kar raha hoon..."
php artisan queue:restart

# Bring the application back online
echo "Panel ko online kar raha hoon..."
php artisan up

echo "Theme rebuild ho gaya hai!"
echo "NOTE: TypeScript/React files ke changes apply karne ke liye aapko Node.js/Yarn chahiye hoga." 