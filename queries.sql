-- Get All departments 
SELECT DISTINCT department_name 
FROM departments;

-- TODO: Need to get all of the classes for a given department
SELECT c.class_id, c.class_name
FROM classes c
JOIN departments d ON c.class_id = d.class_id
WHERE d.department_name = 'Computer Science';

-- TODO: Query to get all of classes taught by professor for all of the professors in a department
SELECT DISTINCT p.professor_id, p.professor_name, c.class_id, c.class_name
FROM professors p
JOIN classes c ON p.professor_id = c.professor_id
JOIN departments d ON p.department_name = d.department_name
WHERE d.department_name = 'Computer Science';

-- TODO: Query from classes table in a department without description with location and sections from classes and sections
-- Uh working on it, have to ask you don't get why not working
SELECT c.class_id, c.class_name, s.class_location, s.class_time, s.recitation, s.capacity
FROM classes c
NATURAL JOIN sections s
WHERE c.class_id IN (
    SELECT class_id
    FROM departments
    WHERE department_name = 'Computer Science'
)
AND c.comments IS NULL;

-- TODO: Query from classes to get reviews for every class in a department
SELECT class_id, class_name, review
FROM classes
WHERE class_id IN (
    SELECT class_id
    FROM departments
    WHERE department_name = 'Computer Science'
);

-- TODO: query to get how many credits student has taken in each department
SELECT d.department_name, SUM(c.credits) AS total_credits
FROM registered r
JOIN classes c ON r.class_id = c.class_id
JOIN departments d ON c.class_id = d.class_id
WHERE r.student_id = '5AWIyFs'
GROUP BY d.department_name;


