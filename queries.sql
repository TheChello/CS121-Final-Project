-- All of the queries used in our project! 

-- Gets all of the distinct departments stored within departments
SELECT DISTINCT department_name 
FROM departments;

-- Returns all of the classes for a given department 
-- (Computer Science in this case)
SELECT c.class_id, c.class_name
FROM classes c NATURAL JOIN departments d
WHERE d.department_name = 'Computer Science';

-- Query to get all of classes taught by professors for all of the 
-- professors in a department *Note, this is their primary department
-- This is equivalent to RA 2 in the Relational Algebra Section
SELECT DISTINCT d.department_name, p.professor_id, p.professor_name, 
c.class_id, c.class_name
FROM professors p NATURAL JOIN classes c NATURAL JOIN departments d
WHERE d.department_name = 'Computer Science';

-- Query from classes table in a department without comments
-- with location and sections from classes and sections. 
-- Without comments here means that these courses have no additional info
-- that is necessary to know (like enforcing prereqs). Comments stores
-- that information, whereas overview stores what the class is about. 
SELECT c.class_id, c.class_name, s.class_location, s.class_time, s.recitation, 
s.capacity
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

-- The next two queries are queries that work, but due to the manner in which
-- we add users, setting up the student_ids to be equal to the salted 
-- user_id fields, then this means that we would be unable to know what the 
-- exact student_id that we want to test for this query is. Both of these 
-- queries are used in our website in the my_credits tab and my_classes tab. 

-- Query to get how many credits student has taken in each department
-- Equivalent to RA1 inside the Relational Algebra Section
SELECT d.department_name, SUM(c.credits) AS total_credits
FROM registered r NATURAL JOIN classes c NATURAL JOIN departments d
WHERE r.student_id = 'Insert_Student_ID'
GROUP BY d.department_name;

-- Query to get all of the classes that a student has signed up for
SELECT c.class_id, c.class_name, s.class_location, s.class_time, s.recitation, s.capacity
FROM registered r NATURAL JOIN classes c NATURAL JOIN sections s 
WHERE r.student_id = 'Insert_Student_ID';



