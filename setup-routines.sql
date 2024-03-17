-- This file setups up all of the routines for Tration!

-- Calculates the total credits for a given student_id based on registrations
DELIMITER //
CREATE FUNCTION calculate_total_credits(student_id VARCHAR(280)) RETURNS INT 
DETERMINISTIC
BEGIN
    DECLARE total_credits INT;
    SELECT SUM(credits) INTO total_credits
    FROM registered r
    NATURAL JOIN classes c
    WHERE r.student_id = student_id;
    RETURN total_credits;
END // 
DELIMITER ;

-- Built a Materialized View to help illustrate that procedures and triggers
-- are working. This view stores all the registrations + credits (registered
-- + credits - section_id). 
CREATE TABLE mv_schedule_view (
    student_id VARCHAR(280), 
    class_id VARCHAR(20), 
    credits INT, 
    PRIMARY KEY (student_id, class_id)
);

INSERT INTO mv_schedule_view (student_id, class_id, credits)
SELECT r.student_id, c.class_id, c.credits
FROM registered r NATURAL JOIN classes c
GROUP BY r.student_id, r.class_id;

-- This view finds the sum of all classes for credits for 1 student, and then
-- also allows for an estimate for the number of classes for the student_id. 
CREATE VIEW mv_schedule_view_for_real AS
SELECT student_id, SUM(credits) AS total_credits, 
CAST(SUM(credits) / 9 AS UNSIGNED) AS estimate_num_of_classes 
FROM mv_schedule_view 
GROUP BY student_id;

DELIMITER //

-- This procedure is called whenever a registration is added or removed, 
-- and appropriately handles updating the materialized view. If the student
-- and class_id combo is already within the view, it acts like a delete 
-- whereas otherwise if its not in, then it acts like an insert. Ensures
-- proper maintaining of the view. 
CREATE PROCEDURE sp_update_schedule(cur_id VARCHAR(280), 
classsss_id VARCHAR(20), sec_id INT)
BEGIN
    -- Update the materialized view
    DECLARE credits INT;
    SELECT c.credits INTO credits FROM classes c NATURAL JOIN sections s 
    WHERE s.class_id = classsss_id AND s.section_id = sec_id;

    -- Acts like an insert if not already in view
    IF ((cur_id NOT IN (SELECT mv_schedule_view.student_id 
    FROM mv_schedule_view)) AND (classsss_id NOT IN 
    (SELECT mv_schedule_view.class_id FROM mv_schedule_view)))
    THEN INSERT INTO mv_schedule_view VALUES (cur_id, classsss_id, credits);

    -- Else, it acts like a delete if already in vie
    ELSE DELETE FROM mv_schedule_view
    WHERE mv_schedule_view.student_id = cur_id AND 
    mv_schedule_view.class_id = classsss_id;
    END IF;
END //

DELIMITER ;

-- This trigger looks if a class has been insereted into the registered 
-- table, and then appropriately updates the view for student. 
DELIMITER !
CREATE TRIGGER trg_register_class AFTER INSERT
       ON registered FOR EACH ROW
BEGIN
    CALL sp_update_schedule(NEW.student_id, NEW.class_id, NEW.section_id);
    CALL sp_update_capacity(NEW.class_id, NEW.section_id);
END !
DELIMITER ;

-- This trigger looks if a class has been deleted from registerd and calls
-- update schedule to handle removing it from the view. 
DELIMITER !
CREATE TRIGGER trg_delete_class AFTER DELETE
       ON registered FOR EACH ROW
BEGIN
      -- Example of calling our helper procedure, passing in the new row's 
      -- information
    CALL sp_update_schedule(OLD.student_id, OLD.class_id, OLD.section_id);
END !
DELIMITER ;

-- This procedure looks at whenever a class gets registered, and appropriately
-- decrements the corresponding section, unless the class is uncapped (i.e.
-- has a current capacity of 0).
DELIMITER //
CREATE PROCEDURE sp_update_capacity(class_id VARCHAR(20), section_id INT)
BEGIN
    -- Update the materialized view
    DECLARE cur_capacity INT;
    SELECT s.capacity INTO cur_capacity FROM sections s 
    WHERE s.class_id = class_id and s.section_id = section_id;

    IF cur_capacity != 0 THEN
        UPDATE sections s
        SET s.capacity = cur_capacity - 1
        WHERE s.class_id = class_id AND s.section_id = section_id;
    END IF;
END //

DELIMITER ;