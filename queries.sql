-- All of the queries used in our project! 

-- Gets all of the distinct departments stored within departments
SELECT DISTINCT department_name 
FROM departments;

-- Returns all of the classes for a given department 
-- (Computer Science in this case)
SELECT c.class_id, c.class_name
FROM classes c NATURAL JOIN departments d
WHERE d.department_name = 'Mathematics';

-- Query to get all of classes taught by professors for all of the 
-- professors in a department *Note, this is their primary department
SELECT DISTINCT d.department_name, p.professor_id, p.professor_name, 
c.class_id, c.class_name
FROM professors p NATURAL JOIN classes c NATURAL JOIN departments d
WHERE d.department_name = 'Computer Science';

-- Query from classes table in a department without description 
-- with location and sections from classes and sections
SELECT c.class_id, c.class_name, s.class_location, s.class_time, s.recitation, s.capacity
FROM classes c
NATURAL JOIN sections s
NATURAL JOIN departments
WHERE department_name = 'Computer Science'
AND c.comments LIKE '';

-- Query from classes to get reviews for every class in a department
SELECT class_id, class_name, review
FROM classes
WHERE class_id IN ( 
    SELECT class_id
    FROM departments
    WHERE department_name = 'Computer Science'
);

-- Query to get how many credits student has taken in each department
SELECT d.department_name, SUM(c.credits) AS total_credits
FROM registered r NATURAL JOIN classes c NATURAL JOIN departments d
WHERE r.student_id = 'Insert_Student_ID'
GROUP BY d.department_name;

-- Query to get all of the classes that a student has signed up for
SELECT c.class_id, c.class_name, s.class_location, s.class_time, s.recitation, s.capacity
FROM registered r NATURAL JOIN classes c NATURAL JOIN sections s 
WHERE r.student_id = 'Insert_Student_ID';



