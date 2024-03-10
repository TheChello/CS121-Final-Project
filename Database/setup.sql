-- Worked With: Yunha Jo

/*
This table houses all of the important information to uniquely identify each
student. It uses student_id as a primary key, and the department_name 
references the departments table as a foreign key. 
*/
CREATE TABLE students (
    student_id  CHAR(7),
    -- This can be 1-4 to indicate Freshmen, Sophmore, Junior, Senior
    grade INT NOT NULL, 
    name VARCHAR(50) NOT NULL, 
    -- Essentially indicates Major, can be Null for Freshmen
    department_name VARCHAR(30), 
    PRIMARY KEY (student_id),
    FOREIGN KEY (department_name) REFERENCES departments(department_name) 
);

/*
This table displays important information to localize where a section is, 
and other necessary information. It needs to have a section_id and a class_id
as primary keys as a section doesn't make sense without a class to reference. 
The class_id will be a foreign key, and will have cascaded permissions because
if a class is deleted/updated, sections needs the corresponding update. 
*/
CREATE TABLE sections (
    section_id INT
    class_id VARCHAR(20),
    location VARCHAR(30), 
    -- Necessary for description times (i.e. Monday/Wednesday 10:30-12:00 pm)
    time VARCHAR(20), 
    ta_name VARCHAR(30), 
    -- Needs to have some capacity, unlimited can be set to a set number: 1000
    capacity INT NOT NULL, 
    PRIMARY KEY (section_id, class_id),
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
    student_id CHAR(7), 
    class_id VARCHAR(20),
    section_id INT, 
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (section_id) REFERENCES section(section_id) ON DELETE CASCADE 
    ON UPDATE CASCADE
);

/* 
This is the main table within this database, and houses all of the technical
information required for any class. 
*/
CREATE TABLE classes (
    class_id VARCHAR(20),
    class_name VARCHAR(25) NOT NULL, 
    -- Needed to include important notes such as if a class is limited seating
    -- and there needs to be a lottery, or if there needs to be an OM
    comments VARCHAR(200), 
    -- General overview of the class
    overview VARCHAR(500), 
    -- To connect to the professors table
    professor_id CHAR(7),
    -- Some common words or phrases to identify this class
    keywords VARCHAR(50), 
    credits INT NOT NULL, 
    -- Can be a max of 9.9
    rating NUMERIC(2, 1),
    review VARCHAR(500),
    term INT NOT NULL, 
    year INT NOT NULL,
    -- The prereq can be a bunch of course_ids put together
    prereq VARCHAR(50),
    -- Either pass-fail or grades
    grade_scheme VARCHAR(10), 
    PRIMARY KEY (class_id), 
    FOREIGN KEY (professor_id) REFERENCES professors(professor_id) ON UPDATE 
    CASCADE
);

/*
Relates the department name to a class_id to allow for easy searching of all
courses that are within the same department. 
*/
CREATE TABLE departments (
    department_name VARCHAR(30), 
    class_id VARCHAR(20),
    PRIMARY KEY (department_name, class_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
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
    FOREIGN KEY (department_name) REFERENCES departments(department_name)
);  