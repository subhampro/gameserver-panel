# PROHostVPS Custom Game Server Panel

A Custom Game Server Panel where you can Host Discord bot and all You need With Proper user management!

Based on Pterodactyl Panel with custom modifications and themes.

![Image](https://i.imgur.com/AFjHGBr.png)

## Features

- Discord bot hosting
- Game server management
- User management system
- Modern and clean interface
- Customized theme and experience

## Installation

This will update your panel to the latest version.

### Enter Maintenance Mode

```bash
cd /var/www/pterodactyl
php artisan down
```

### Install Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### Clear Compiled Template Cache

```bash
php artisan view:clear
php artisan config:clear
```

### Database Updates

```bash
php artisan migrate --seed --force
```

### Set Permissions

```bash
# If using NGINX or Apache (not on CentOS):
chown -R www-data:www-data /var/www/pterodactyl/*

# If using NGINX on CentOS:
chown -R nginx:nginx /var/www/pterodactyl/*

# If using Apache on CentOS
chown -R apache:apache /var/www/pterodactyl/*
```

### Restarting Queue Workers

```bash
php artisan queue:restart
```

### Exit Maintenance Mode

```bash
php artisan up
```

## Documentation

* [Panel Documentation](https://pterodactyl.io/panel/1.0/getting_started.html)
* [Wings Documentation](https://pterodactyl.io/wings/1.0/installing.html)
* [Community Guides](https://pterodactyl.io/community/about.html)

## License

Based on Pterodactyl Panel. Customized by PROHostVPS.
Pterodactyl® Copyright © 2015 - 2023 Dane Everitt and contributors.
