-- Instructions:
-- This script will load the 4 CSV files you broke down from playlist_data.csv
-- into the tables you created in setup-spotify.sql.
-- Intended for use with the command-line MySQL, otherwise unnecessary for
-- phpMyAdmin (just import each CSV file in the GUI).

-- Make sure this file is in the same directory as your 4 CSV files and
-- setup-spotify.sql. Then run the following in the mysql> prompt (assuming
-- you have a spotifydb created with CREATE DATABASE spotifydb;):
-- USE DATABASE spotifydb; 
-- source setup-spotify.sql; (make sure no warnings appear)
-- source load-spotify.sql; (make sure there are 0 skipped/warnings)
-- [Problem 1]


-- -- [Problem 2]
LOAD DATA LOCAL INFILE 'Database/departments.csv' INTO TABLE departments
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'Database/students.csv' INTO TABLE students
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'Database/professors.csv' INTO TABLE professors
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'Database/classes.csv' INTO TABLE classes
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'Database/sections.csv' INTO TABLE sections
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'registered.csv' INTO TABLE registered
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;



