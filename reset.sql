-- File used to run all code :). 
create database tration;
use tration;
source setup.sql;
source load-data.sql;
source setup-passwords.sql;
source setup-routines.sql;
source grant-permissions.sql;