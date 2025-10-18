CREATE DATABASE IF NOT EXISTS cyshield;
USE cyshield;

CREATE USER IF NOT EXISTS 'cyshield_user'@'%' IDENTIFIED BY 'cyshield_password';
GRANT ALL PRIVILEGES ON cyshield.* TO 'cyshield_user'@'%';
FLUSH PRIVILEGES;
