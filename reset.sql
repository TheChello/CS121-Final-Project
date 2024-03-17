-- File used to run all code :). 
SET GLOBAL local_infile = 1;
CREATE DATABASE tration;
USE tration;
source setup.sql;
source load-data.sql;
source setup-passwords.sql;
source setup-routines.sql;
source grant-permissions.sql;