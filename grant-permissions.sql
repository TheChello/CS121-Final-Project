CREATE USER 'appadmin'@'localhost' IDENTIFIED BY 'adminpw';
CREATE USER 'appclient'@'localhost' IDENTIFIED BY 'clientpw';

GRANT ALL PRIVILEGES ON tration.* TO 'appadmin'@'localhost';
GRANT SELECT ON tration.* TO 'appclient'@'localhost';
GRANT INSERT ON tration.* TO 'appclient'@'localhost';
GRANT EXECUTE ON tration.* TO 'appclient'@'localhost';

ALTER USER 'appclient'@'localhost' IDENTIFIED WITH mysql_native_password BY 'clientpw';
ALTER USER 'appadmin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'adminpw';
FLUSH PRIVILEGES;
