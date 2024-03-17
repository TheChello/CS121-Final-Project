-- Worked With: Yunha Jo

-- DROP TABLE COMMANDS:
DROP TABLE IF EXISTS registered;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS professors;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS user_info;

/*
Stores information for both admins and students, which will allow us to 
authenticate future logins and 
*/
CREATE TABLE user_info (
    -- Will be generated to match whether or not user is_admin or not
    user_id VARCHAR(280), 
    password_hash VARCHAR(280) NOT NULL, 
    user_name VARCHAR(20) NOT NULL,

    -- True for admin, False for students 
    is_admin BOOLEAN NOT NULL, 
    salt CHAR(8) NOT NULL, 

    UNIQUE (user_id, password_hash), 
    PRIMARY KEY (user_id)
);

/*
Relates the department name to a class_id to allow for easy searching of all
courses that are within the same department. 
*/
CREATE TABLE departments (
    department_name VARCHAR(30), 
    class_id VARCHAR(20),
    PRIMARY KEY (department_name, class_id)
);

/*
This table houses all of the important information to uniquely identify each
student. It uses student_id as a primary key, and the department_name 
references the departments table as a foreign key. 
*/
CREATE TABLE students (
    -- If user is not an admin, then their user_id will serve as their 
    -- student_id. 
    student_id  VARCHAR(280),
    -- This can be 1-4 to indicate Freshmen, Sophmore, Junior, Senior
    grade INT NOT NULL, 
    student_name VARCHAR(50) NOT NULL, 

    -- Essentially indicates Major, can be Null for Freshmen
    department_name VARCHAR(30), 

    CHECK (grade IN (1, 2, 3, 4)), 
    PRIMARY KEY (student_id)
);

/*
Relates the professor_id to a professor_name as well as what department they
are in. 
*/
CREATE TABLE professors (
    professor_id CHAR(7), 
    professor_name VARCHAR(40),
    department_name VARCHAR(30) NOT NULL, 
    PRIMARY KEY (professor_id, professor_name)
);  

/* 
This is the main table within this database, and houses all of the technical
information required for any class. 
*/
CREATE TABLE classes (
    class_id VARCHAR(20),
    class_name VARCHAR(50) NOT NULL, 
    -- Needed to include important notes such as if a class is limited seating
    -- and there needs to be a lottery, or if there needs to be an OM
    comments VARCHAR(200), 
    -- General overview of the class
    overview VARCHAR(1000), 
    -- To connect to the professors table
    professor_id CHAR(7),
    -- Some common words or phrases to identify this class
    keywords VARCHAR(50), 
    credits INT NOT NULL, 
    -- Can be a max of 9.9
    rating NUMERIC(2, 1),
    review VARCHAR(500),
    term INT NOT NULL, 
    cur_year YEAR NOT NULL,
    -- The prereq can be a bunch of course_ids put together
    prereq VARCHAR(50),
    -- Either pass-fail or grades
    grade_scheme VARCHAR(10), 

    CHECK (term IN (1, 2, 3, 4)), 
    PRIMARY KEY (class_id), 
    FOREIGN KEY (professor_id) REFERENCES professors(professor_id) ON UPDATE 
    CASCADE

);

/*
This table displays important information to localize where a section is, 
and other necessary information. It needs to have a section_id and a class_id
as primary keys as a section doesn't make sense without a class to reference. 
The class_id will be a foreign key, and will have cascaded permissions because
if a class is deleted/updated, sections needs the corresponding update. 
*/
CREATE TABLE sections (
    -- sections are a weak-entity set, as multiple classes will share the 
    -- same section numbers, so they need class_id to help uniquely identify.
    section_id INT, 
    class_id VARCHAR(20),

    -- Sometimes locations for sections are not defined upon creation.
    class_location VARCHAR(20), 
    -- Necessary for description times (i.e. Monday/Wednesday 10:30-12:00 pm)
    class_time VARCHAR(20), 
    recitation VARCHAR(30), 
    -- Sometimes TAs haven't been setup before a class/section is offered
    ta_name VARCHAR(30), 
    -- If capacity is NULL, then it essentially means the section is uncapped.
    capacity INT, 
    PRIMARY KEY (section_id, class_id),

    -- If a class_id gets deleted, then it makes no sense to keep the sections
    -- as they aren't tied to a class. If a class gets updated, then you
    -- would want the updated ID to be shown. 
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
    ON UPDATE CASCADE
);

/*
Connects students to the sections they registered for within classes. All
of the fields are primary keys. All of this information needs to be cascaded
as if any of the primary keys are updated, we would want the registration to
reflect that.  
*/
CREATE TABLE registered (
    student_id VARCHAR(280), 
    class_id VARCHAR(20),
    section_id INT, 

    PRIMARY KEY (student_id, class_id),

    -- If a student is removed from the institution, their registrations 
    -- should also be removed. If a student_id gets updated (replacing a 
    -- student with another one), then we would also want to show that as 
    -- well. 
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    ON UPDATE CASCADE,
    -- If a class gets removed, we would want to remove it from registered, 
    -- same as if it gets updated. 
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE 
    ON UPDATE CASCADE, 
    -- If a section_id gets deleted, then we wouldn't want to just remove
    -- the student from being in the class. This would mean that we are
    -- leaving a registration that isn't possible inside registered, that 
    -- -- can be handled with a procedure for this specific case. 
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON UPDATE CASCADE
);

CREATE INDEX idx_class_name ON classes(class_id, class_name);
-- ^ Above is tested and in doc, the one below isn't yet
-- CREATE INDEX idx_grade ON students(grade);

-- Query for idx_class_name (in reflection as well): 
-- SELECT class_id, class_name from classes where class_name like 'Intro%';