DELIMITER //
CREATE FUNCTION CalculateTotalCredits(student_id CHAR(7)) RETURNS INT 
DETERMINISTIC
BEGIN
    DECLARE total_credits INT;
    SELECT SUM(credits) INTO total_credits
    FROM registered r
    JOIN classes c ON r.class_id = c.class_id
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
    FROM departments d
    JOIN classes c ON d.class_id = c.class_id
    WHERE d.department_name = department_name;
    RETURN num_courses;
END //
DELIMITER ;

CREATE VIEW schedule_view AS
SELECT r.student_id, c.class_id, COUNT(*) AS total_credits
FROM registered r
JOIN classes c ON r.class_id = c.class_id
GROUP BY r.student_id, c.class_id;

DELIMITER //

CREATE PROCEDURE update_schedule(IN student_id CHAR(7), IN class_id VARCHAR(20))
BEGIN
    -- Update the materialized view
    UPDATE schedule_view
    SET total_credits = (
        SELECT SUM(credits)
        FROM registered r
        JOIN classes c ON r.class_id = c.class_id
        WHERE r.student_id = student_id
    )
    WHERE student_id = student_id;

    -- Insert or update the student's registration
    REPLACE INTO registered (student_id, class_id)
    VALUES (student_id, class_id);
END //

DELIMITER ;

-- 5AWIyFs
