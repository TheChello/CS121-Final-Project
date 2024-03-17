-- File used to run all code :). 
SET GLOBAL local_infile = 1;
create database tration;
use tration;
source setup.sql;
source load-data.sql;
source setup-passwords.sql;
source setup-routines.sql;
source grant-permissions.sql;