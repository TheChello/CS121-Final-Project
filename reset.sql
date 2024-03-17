drop database tration;
create database tration;
use tration;
source setup.sql;
source setup-passwords.sql;
source load.sql;

DELIMITER !
CREATE FUNCTION make_salt(num_chars INT)
RETURNS VARCHAR(20) DETERMINISTIC
BEGIN
    DECLARE salt VARCHAR(20) DEFAULT '';

    -- Don't want to generate more than 20 characters of salt.
    SET num_chars = LEAST(20, num_chars);

    -- Generate the salt!  Characters used are ASCII code 32 (space)
    -- through 126 ('z').
    WHILE num_chars > 0 DO
        SET salt = CONCAT(salt, CHAR(32 + FLOOR(RAND() * 95)));
        SET num_chars = num_chars - 1;
    END WHILE;

    RETURN salt;
END !
DELIMITER ;

DELIMITER !
CREATE PROCEDURE sp_add_user(username VARCHAR(20), password VARCHAR(20), grade INT, student_name VARCHAR(50), department_name VARCHAR(30))
BEGIN
  DECLARE salt VARCHAR(8) DEFAULT make_salt(8); 
  DECLARE new_password VARCHAR(28) DEFAULT CONCAT(salt, password);
  DECLARE new_username VARCHAR(28) DEFAULT CONCAT(salt, username);
  INSERT INTO user_info 
  VALUES (SHA2(new_username, 256), SHA2(new_password, 256), username, False, salt);
  INSERT INTO students
  VALUES (SHA2(new_username, 256), grade, student_name, department_name);

END !
DELIMITER ;

CALL sp_add_user('5AWIyFs', 'temp', 1, 'Leimomi Lochlainn', '');
CALL sp_add_user('J6ZeCRH', 'temp', 3, 'Thersa Anat', 'Computer Science');
CALL sp_add_user('YKGy6nP', 'temp', 2, 'Sanjay Nitzan', 'Electrical Engineering');
CALL sp_add_user('EUz4DZz', 'temp', 3, 'Gerwas Proserpina', 'Electrical Engineering');
CALL sp_add_user('fT4RBAR', 'temp', 2, 'Leocadia Dipa', 'Mechanical Engineering');
CALL sp_add_user('wWUH9eS', 'temp', 2, 'Sveta Shanna', 'Computer Science');
CALL sp_add_user('MnrLpHo', 'temp', 1, 'Omid Ríoghán', '');
CALL sp_add_user('p0scLID', 'temp', 4, 'Marina Tindra', 'Mechanical Engineering');
CALL sp_add_user('68jPioc', 'temp', 2, 'Amirah Argiñe', 'Mathematics');
CALL sp_add_user('5ojjTEP', 'temp', 2, 'Minos Duncan', 'Computer Science');
CALL sp_add_user('k1fclMO', 'temp', 1, 'Carla Pijus', '');
CALL sp_add_user('ro8ZA4F', 'temp', 2, 'Gualberto Zazil', 'Mechanical Engineering');
CALL sp_add_user('nXGSikD', 'temp', 3, 'Božica Kishor', 'Mathematics');
CALL sp_add_user('qaehllZ', 'temp', 4, 'Gerd Marjolaine', 'Computer Science');
CALL sp_add_user('M4FJla9', 'temp', 2, 'Ljubomir Manjula', 'Electrical Engineering');
CALL sp_add_user('l24hAwU', 'temp', 3, 'Ibrahim Uno', 'Mechanical Engineering');
CALL sp_add_user('psBmGXJ', 'temp', 4, 'Mercia Yehowah', 'Information and Data Sciences');
CALL sp_add_user('d52DJMW', 'temp', 3, 'Paden Hut-Heru', 'Computer Science');
CALL sp_add_user('vBijjg2', 'temp', 2, 'Chloris Mislav', 'Electrical Engineering');
CALL sp_add_user('7qnA8cQ', 'temp', 3, 'Seleucus Knútr', 'Mechanical Engineering');
CALL sp_add_user('NNuCo8L', 'temp', 1, 'Paulus Benedetta', '');
CALL sp_add_user('h8Akain', 'temp', 1, 'Businge Tancrède', '');
CALL sp_add_user('kp8QbC9', 'temp', 3, 'Ùna Bao', 'Electrical Engineering');
CALL sp_add_user('MmtYJP1', 'temp', 2, 'Aikorkem Arthur', 'Information and Data Sciences');
CALL sp_add_user('ZMRyJzS', 'temp', 1, 'Atalanta Yunuen', '');