/**
 * Author: Yunha Jo, Shrey Srivastava
 * CS 121 Winter 2024
 * Date: March 17, 2024
 * This is node_mysql.js that interacts with Tration, REGIS-based database that
 * improves User Interaction
 */

"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
const mysql = require("promise-mysql");
const cookieParser = require("cookie-parser");

// To handle different POST formats
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

app.use(cookieParser());
const COOKIE_EXP_TIME = 3 * 24 * 60 * 60 * 1000; // login cookies last 3 days.

const DEBUG = true;
const SERVER_ERROR = "Something went wrong on the server... Please try again later.";
const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;

app.use(express.static("public"));

/*---- SELECT queries ------ */

/**
 * Gets all of departments in the database
 */

app.get("/departments", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let deparmentNames = await getDepartments(db);
      let result = Object.values(JSON.parse(JSON.stringify(deparmentNames)));
      let lst = parseDepartments(result);
      res.json(lst);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
 * Calls the query to get all of departments in the database
 */

async function getDepartments(db) {
    let query = "SELECT DISTINCT department_name FROM departments";
    let rows = await db.query(query);
    return rows;
  }

/**
 * Helper function for parsing data
 */

function parseDepartments(departmentRows) {
    let departmentLst = [];
    departmentRows.forEach((department) => departmentLst.push(department.department_name));
    return departmentLst;
}

/**
 * Gets all of the classes in a department
 */

app.get("/departments/classes", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let tmp = req.query["department"];
      let department = tmp.replaceAll("_", " ");
      let deparmentClasses = await getClassesDepartment(department, db);
      let result = JSON.parse(JSON.stringify(deparmentClasses));
      res.json(result);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
 * Calls query to get all of the classes in a department
 */

async function getClassesDepartment(department, db) {
    let query = "SELECT c.class_id, c.class_name, c.credits, c.term, \
    c.prereq, c.overview, p.professor_name FROM classes c \
    JOIN departments d ON c.class_id = d.class_id JOIN professors p \
    ON c.professor_id = p.professor_id WHERE d.department_name = ? \
    ORDER BY c.class_id;";
    let rows = await db.query(query, [department]);
    return rows;
  }

/**
* Gets all of the classes taught by professors in a department
 */

app.get("/departments/professors", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let tmp = req.query["department"];
      let department = tmp.replaceAll("_", " ");
      let professorClasses = await getDepartmentProfessors(db, department);
      let result = JSON.parse(JSON.stringify(professorClasses));
      res.json(result);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
* Calls query to get all of the classes taught by professors in a department
 */

async function getDepartmentProfessors(db, department) {
    let query = "SELECT DISTINCT p.professor_name, c.class_id, c.class_name \
    FROM professors p \
    JOIN classes c ON p.professor_id = c.professor_id \
    JOIN departments d ON p.department_name = d.department_name \
    WHERE d.department_name = 'Computer Science';";
    let rows = await db.query(query, [department]);
    return rows;
  }

/**
  * Gets all of the classes offered in the database along with
  * their sections
 */

// Design decision: do we get all of the classes in a department first?
// Or do we get all of the classes in general?
app.get("/classes-current", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let currentClasses = await getDepartmentClasses(db);
      let result = JSON.parse(JSON.stringify(currentClasses));
      res.json(result);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
  * Calls query to get all of the classes offered in the database along with
  * their sections
 */

async function getDepartmentClasses(db) {
    let query = "SELECT c.class_id, c.class_name, s.section_id, s.class_location, s.class_time, s.recitation, s.capacity \
    FROM classes c \
    NATURAL JOIN sections s \
    NATURAL JOIN departments";
    let rows = await db.query(query);
    return rows;
  }

/**
 * Gets all of the reviews for classes in a department
 */

app.get("/departments/reviews", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let tmp = req.query["department"];
      let department = tmp.replaceAll("_", " ");
      let departmentReviews = await getDepartmentReviews(db, department);
      let result = JSON.parse(JSON.stringify(departmentReviews));
      res.json(result);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
 * Calls query to get all of the reviews for classes in a department
 */

async function getDepartmentReviews(db, department) {
    let query = "SELECT class_id, class_name, review, rating \
    FROM classes \
    WHERE class_id IN ( \
        SELECT class_id \
        FROM departments \
        WHERE department_name = ?);";
    let rows = await db.query(query, [department]);
    return rows;
  }

/**
  * Gets all of the classes that student has registered for 
  * for the current user
 */

app.get("/student/classes", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let userid = req.cookies.userid;
      let studentClasses = await getStudentClasses(db, userid);
      console.log(studentClasses)
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

/**
  * Calls query to get all of the classes that student has registered for 
  * for the current user
 */

async function getStudentClasses(db, userid) {
  let query = 'SELECT c.class_id, c.class_name, s.section_id, s.class_location, s.class_time, s.recitation, s.capacity \
              FROM registered r NATURAL JOIN classes c NATURAL JOIN sections s \
              WHERE r.student_id = ?'
  let rows = await db.query(query, [userid]);
  return rows;
}

/**
  * Gets all the credits in each department that given
  * user has signed up for
 */

app.get("/student/credits", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let userid = req.cookies.userid;
    let studentCredits = await getStudentCredits(db, userid);
    let tmp = JSON.parse(JSON.stringify(studentCredits));
    res.json(tmp);
  } catch (error) {
    res.type("text");
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
  if (db) {
    db.end();
  }
});

/**
  * Calls query to get all the credits in each department that given
  * user has signed up for
 */

async function getStudentCredits(db, userid) {
    let query = "SELECT d.department_name, SUM(c.credits) AS total_credits \
    FROM registered r NATURAL JOIN classes c NATURAL JOIN departments d \
    WHERE r.student_id = ? \
    GROUP BY d.department_name;";
    let rows = await db.query(query, [userid]);
    return rows;
  }

/*---- INSERT queries ------*/

/**
 * Registers a student for given class and section
 */

app.post("/students/register", async (req, res, next) => {
    if (!(req.cookies["logged_in"] && req.cookies.userid)) {
      res.status(CLIENT_ERR_CODE);
      next(Error("Need to be Logged In"));
    } else {
      let db;
      try {
        db = await getDB();
        let uid = req.cookies.userid;
        let class_id = req.body.class_id;
        let section_id = req.body.section_id;
        let success = await registerClass(uid, class_id, section_id, db);
        if (success) {
          console.log("Successful")
          res.type("text");
          res.send(`Successfully added!`);
        }
        else {
          res.status(CLIENT_ERR_CODE);
          next(Error("Unable to register"));
        }
      } catch (err) { // some other server-side error occured
        if (db) {
          db.end();
        }
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
      }
    }
  });

/**
 * Calls query that inserts students into the registered table
 */

async function registerClass(uid, class_id, section_id, db) {
  let query = "INSERT INTO registered VALUES (?, ?, ?);";
  let result = await db.query(query, [uid, class_id, section_id]);
  return result.affectedRows > 0;
}


/**
 * Login function that allows users to login to the website
 */

app.post("/login", async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!(username && password)) {
    res.status(CLIENT_ERR_CODE);
    next(Error("Missing password or username"));
  } else {
    let db;
    try {
      db = await getDB(); // don't establish connection until we need to.
      let tmp = await authenticateUser(username, password, db);
      tmp = JSON.parse(JSON.stringify(tmp));
      let useridlst = Object.values(tmp[0]);
      let userid = useridlst[0];
      if (userid) {
        res.cookie("logged_in", "true", { maxAge: COOKIE_EXP_TIME });
        res.cookie("userid", userid, { maxAge: COOKIE_EXP_TIME });
        res.type("text");
        res.send(`Logged in Successfully!`);
      } else {
        res.status(401).send("Invalid login credentials.");
      }
    } catch (err) {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) { 
      db.end();
    }
  }
});


/**
 * Authenticates the user
 */

async function authenticateUser(username, password, db) {
  let procedure = "SELECT authenticate(?, ?);";
  let result = await db.query(procedure, [username, password]);
  return result;
}

/**
  * Logs the user out of the current website
 */

app.post("/logout", async (req, res) => {
  let msg;
  if (!(res.cookie["logged_in"] != "true")) {
    // no error if the cookie doesn't exist.
    msg = "You are not currently logged in.";
  } else {
    res.clearCookie("logged_in"); 
    res.clearCookie("userid");
    msg = "Successfully logged out!";
  }
  res.type("text");
  res.send(msg);
});

/**
  * Allows the user to create account on the database
 */

app.post("/signup", checkLogin, async (req, res, next) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  let grade = req.body.grade;
  let major = req.body.major;
  if (!(firstName && lastName && username && password && grade)) {
    res.status(CLIENT_ERR_CODE);
    next(Error("Missing required information."));
  }
  if (username.length > 20) {
    res.status(CLIENT_ERR_CODE);
    next(Error("User names must be under 20 characters."));
  } 
  else {
    let db;
    try {
      db = await getDB(); // don't establish connection until we need to.
      let result = await addNewUser(firstName, lastName, username, password, grade, major, db);
      res.type("text");
      res.send(`Successfully created account!`);
    } catch (err) {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) { 
      db.end();
    }
  }
});

/**
  * Adds user to the databse
 */

async function addNewUser(firstName, lastName, username, password, grade, major, db) {
  let procedure = 'call sp_add_user(?, ?, ?, ?, ?);';
  let result = await db.query(procedure, [username, password, grade, firstName + " " +lastName, major]);
  return result;
}

/**
  * Establishes connection to the database
 */

async function getDB() {
  let db = await mysql.createConnection({
    // Variables for connections to the database.
    host: "localhost",      
    port: "3306",          
    user: "appclient",         
    password: "clientpw",    
    database: "tration"
  });
  return db;
}

/**
  * Error Handler function
 */

function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.error(err);
  }
  // All error responses are plain/text 
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
