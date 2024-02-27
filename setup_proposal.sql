-- Worked With: Yunha Jo

CREATE TABLE students (
    student_id  CHAR(7),
    grade INT NOT NULL, 
    name VARCHAR(50) NOT NULL, 
    major VARCHAR(30), 
    PRIMARY KEY (student_id)
);

CREATE TABLE sections (
    section_id INT
    class_id  CHAR(7),
    location VARCHAR(30), 
    time VARCHAR(20) , 
    ta_id CHAR(7), 
    PRIMARY KEY (section_id, class_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE 
);

CREATE TABLE registered (
    student_id CHAR(7), 
    class_id CHAR(7),
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id_id) ON DELETE CASCADE
);

CREATE TABLE classes (
    class_id CHAR(7),
    class_name VARCHAR(25) NOT NULL, 
    professor_id CHAR(7) NOT NULL,
    keywords VARCHAR(50), 
    capacity INT NOT NULL, 
    credits INT NOT NULL, 
    rating NUMERIC(2, 1),
    review VARCHAR(500),
    PRIMARY KEY (class_id)
);

CREATE TABLE departments (
    department_name VARCHAR(30), 
    class_id CHAR(7),
    PRIMARY KEY (department_name, class_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);



