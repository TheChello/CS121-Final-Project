-- CS 121 24wi: Password Management (A6 and Final Project)
-- Shrey and Yunha 

-- This function generates a specified number of characters for 
-- using as a salt in passwords.
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

/*
Stores information for both admins and students, which will allow us to 
authenticate future logins and 
*/
-- CREATE TABLE user_info (
--     -- Will be generated to match whether or not user is_admin or not
--     user_id VARCHAR(28), 
--     password_hash VARCHAR(28) NOT NULL, 
--     user_name VARCHAR(20) NOT NULL,

--     -- True for admin, False for students 
--     is_admin BOOLEAN NOT NULL, 
--     salt CHAR(8) NOT NULL, 

--     UNIQUE (user_id, password_hash), 
--     PRIMARY KEY (user_id)
-- );

-- [Problem 1a]
-- Adds a new user to the user_info table, using the specified password (max
-- of 20 characters). Salts the password with a newly-generated salt value,
-- and then the salt and hash values are both stored in the table.
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

-- [Problem 1b]
-- Authenticates the specified username and password against the data
-- in the user_info table.  Returns 1 if the user appears in the table, 
-- and the
-- specified password hashes to the value for the user. Otherwise returns 0.
DELIMITER !
CREATE FUNCTION authenticate(username VARCHAR(20), password VARCHAR(20))
RETURNS VARCHAR(280) DETERMINISTIC
BEGIN
  DECLARE saltt VARCHAR(8) DEFAULT NULL;
  DECLARE pwd VARCHAR(400) DEFAULT NULL;
  DECLARE id VARCHAR(280) DEFAULT NULL;

  IF username NOT IN (SELECT user_name FROM user_info)
  THEN RETURN 'user_name was not found';

  ELSE 
    SELECT DISTINCT salt INTO saltt FROM user_info 
    WHERE user_info.username = username;
    SELECT DISTINCT password_hash INTO pwd FROM user_info 
    WHERE user_info.username = username;
    SELECT DISTINCT user_id INTO id FROM user_info 
    WHERE user_info.username = username;
    IF SHA2(CONCAT(saltt, password), 256) = pwd 
    AND SHA2(CONCAT(saltt, username), 256) = id
    THEN RETURN id;
    ELSE RETURN 'authentication failed';
    END IF;
  END IF;
END !
DELIMITER ;

-- [Problem 1d]
-- Create a procedure sp_change_password to generate a new salt and 
-- change the given user's password to the given password (after salting and hashing)
-- NOTE: If used in website, this would only be used after authenticating
-- the user, as is the practice on most websites when you want to change your
-- password, you sign in, and then change password. 
DELIMITER !
CREATE PROCEDURE sp_change_password(username VARCHAR(20), 
new_password VARCHAR(20))
BEGIN
  DECLARE saltt VARCHAR(8) DEFAULT make_salt(8); 
  DECLARE new_password2 VARCHAR(28) DEFAULT CONCAT(saltt, new_password);

  UPDATE user_info 
  SET password_hash = SHA2(new_password2, 256), salt = saltt 
  WHERE user_info.username = username;
END !
DELIMITER ;