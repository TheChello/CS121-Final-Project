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

DELIMITER //
CREATE FUNCTION num_courses_in_department(department_name VARCHAR(30))
RETURNS INT DETERMINISTIC
BEGIN
    DECLARE num_courses INT;
    SELECT COUNT(*) INTO num_courses
    FROM departments d NATURAL JOIN classes c
    WHERE d.department_name = department_name;
    RETURN num_courses;
END //
DELIMITER ;

CREATE TABLE schedule_view (
    student_id VARCHAR(280), 
    class_id VARCHAR(20), 
    total_credits INT, 
    PRIMARY KEY (student_id, class_id)
);

INSERT INTO schedule_view (student_id, class_id, total_credits)
SELECT r.student_id, c.class_id, calculate_total_credits(r.student_id)
FROM registered r NATURAL JOIN classes c
GROUP BY r.student_id, r.class_id;

CREATE VIEW schedule_view_for_real AS
SELECT student_id, SUM(total_credits) AS credits, 
CAST(SUM(total_credits) / 9 AS UNSIGNED) AS estimate_num_of_classes 
FROM schedule_view GROUP BY student_id;

DELIMITER //

CREATE PROCEDURE sp_update_schedule(student_id VARCHAR(280), class_id VARCHAR(20))
BEGIN
    -- Update the materialized view
    UPDATE schedule_view
    SET total_credits = (
        SELECT SUM(credits)
        FROM registered r
        NATURAL JOIN classes c
        WHERE r.student_id = student_id
    )
    WHERE student_id = student_id;
END //

DELIMITER ;

-- 5AWIyFs
DELIMITER !
CREATE TRIGGER trg_register_class AFTER INSERT
       ON registered FOR EACH ROW
BEGIN
      -- Example of calling our helper procedure, passing in the new row's 
      -- information
    CALL sp_update_schedule(NEW.student_id, NEW.class_id);
    CALL sp_update_capacity(NEW.class_id, NEW.section_id);
END !
DELIMITER ;

DELIMITER !
CREATE TRIGGER trg_delete_class AFTER DELETE
       ON registered FOR EACH ROW
BEGIN
      -- Example of calling our helper procedure, passing in the new row's 
      -- information
    CALL sp_update_schedule(OLD.student_id, OLD.class_id);
END !
DELIMITER ;

-- INSERT INTO registered (student_id, class_id) 
-- VALUES ('5AWIyFs', 'CS 137');

-- DELETE FROM registered WHERE student_id = '5AWIyFs' and class_id = 'CS 003';

-- When someone registers for a class, want capacity to go down
DELIMITER //

CREATE PROCEDURE sp_update_capacity(class_id VARCHAR(20), section_id INT)
BEGIN
    -- Update the materialized view
    DECLARE cur_capacity INT;
    SELECT s.capacity INTO cur_capacity FROM sections s WHERE s.class_id = class_id;

    IF cur_capacity != 0 THEN
        UPDATE sections
        SET capacity = cur_capacity - 1
        WHERE s.class_id = class_id AND s.section_id = section_id;
    END IF;
END //

DELIMITER ;
