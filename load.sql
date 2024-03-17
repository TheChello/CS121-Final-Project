LOAD DATA LOCAL INFILE 'departments.csv' INTO TABLE departments
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

-- LOAD DATA LOCAL INFILE 'students.csv' INTO TABLE students
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' 
-- IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'professors.csv' INTO TABLE professors
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'classes.csv' INTO TABLE classes
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'sections.csv' INTO TABLE sections
FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' 
IGNORE 1 ROWS;

-- LOAD DATA LOCAL INFILE 'registered.csv' INTO TABLE registered
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' 
-- IGNORE 1 ROWS;



