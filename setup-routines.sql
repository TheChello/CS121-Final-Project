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

CREATE TABLE schedule_view (
    student_id VARCHAR(280), 
    class_id VARCHAR(20), 
    credits INT, 
    PRIMARY KEY (student_id, class_id)
);

-- To prove routines work
INSERT INTO schedule_view (student_id, class_id, credits)
SELECT r.student_id, c.class_id, c.credits
FROM registered r NATURAL JOIN classes c
GROUP BY r.student_id, r.class_id;

CREATE VIEW schedule_view_for_real AS
SELECT student_id, SUM(credits) AS total_credits, 
CAST(SUM(credits) / 9 AS UNSIGNED) AS estimate_num_of_classes 
FROM schedule_view 
GROUP BY student_id;

DELIMITER //

CREATE PROCEDURE sp_update_schedule(cur_id VARCHAR(280), classsss_id VARCHAR(20), sec_id INT)
BEGIN
    -- Update the materialized view
    DECLARE credits INT;
    SELECT c.credits INTO credits FROM classes c NATURAL JOIN sections s WHERE s.class_id = classsss_id AND s.section_id = sec_id;
    IF ((cur_id NOT IN (SELECT schedule_view.student_id FROM schedule_view)) AND (classsss_id NOT IN (SELECT schedule_view.class_id FROM schedule_view)))
    THEN INSERT INTO schedule_view VALUES (cur_id, classsss_id, credits);
    ELSE DELETE FROM schedule_view
    WHERE schedule_view.student_id = cur_id AND schedule_view.class_id = classsss_id;
    END IF;
END //

DELIMITER ;

-- 5AWIyFs
DELIMITER !
CREATE TRIGGER trg_register_class AFTER INSERT
       ON registered FOR EACH ROW
BEGIN
      -- Example of calling our helper procedure, passing in the new row's 
      -- information
    CALL sp_update_schedule(NEW.student_id, NEW.class_id, NEW.section_id);
    CALL sp_update_capacity(NEW.class_id, NEW.section_id);
END !
DELIMITER ;

DELIMITER !
CREATE TRIGGER trg_delete_class AFTER DELETE
       ON registered FOR EACH ROW
BEGIN
      -- Example of calling our helper procedure, passing in the new row's 
      -- information
    CALL sp_update_schedule(OLD.student_id, OLD.class_id, OLD.section_id);
END !
DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_update_capacity(class_id VARCHAR(20), section_id INT)
BEGIN
    -- Update the materialized view
    DECLARE cur_capacity INT;
    SELECT s.capacity INTO cur_capacity FROM sections s WHERE s.class_id = class_id and s.section_id = section_id;

    IF cur_capacity != 0 THEN
        UPDATE sections s
        SET s.capacity = cur_capacity - 1
        WHERE s.class_id = class_id AND s.section_id = section_id;
    END IF;
END //

DELIMITER ;