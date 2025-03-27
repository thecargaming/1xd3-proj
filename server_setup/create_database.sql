CREATE USER 'chenp102_local'@'localhost' IDENTIFIED BY 'password';

CREATE DATABASE chenp102_db;

GRANT ALL PRIVILEGES ON chenp102_db.* TO 'chenp102_local'@'localhost';
