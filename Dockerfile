# Use official PHP + Apache image
FROM php:8.2-apache

# Install PHP extensions if needed (example: mysqli for MySQL)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy backend and api into Apache root
http://localhost:3000/login

# Set working directory
WORKDIR /var/www/html

# Enable Apache mod_rewrite (for clean URLs)
RUN a2enmod rewrite

# Configure Apache to allow .htaccess overrides
RUN echo "<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/docker-php.conf \
    && a2enconf docker-php

# Expose port 80 for web traffic
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
