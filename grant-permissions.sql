CREATE USER 'appadmin'@'localhost' IDENTIFIED BY 'adminpw';
CREATE USER 'appclient'@'localhost' IDENTIFIED BY 'clientpw';
-- Can add more users or refine permissions
GRANT ALL PRIVILEGES ON tration.* TO 'appadmin'@'localhost';
GRANT SELECT ON tration.* TO 'appclient'@'localhost';
GRANT INSERT ON tration.* TO 'appclient'@'localhost';
FLUSH PRIVILEGES;
