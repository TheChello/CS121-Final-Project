"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
const mysql = require("promise-mysql");
const cookieParser = require("cookie-parser");
// const bcrypt = require("bcrypt"); // for optional password hashing; see brcrypt docs

// To handle different POST formats
app.use(express.urlencoded({ extended: true }))
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
 * Need to get all of the department
 */

app.get("/departments", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let deparmentNames = await getDepartments(db);
      res.json(deparmentNames);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

async function getDepartments(db) {
    let query = "SELECT DISTINCT department_name FROM departments";
    let rows = await db.query(query);
    console.log(rows);
    return rows;
  }

/**
 * Need to get all of classes in a department
 */

app.get("/departments/classes", async (req, res) => {
    let db;
    try {
      db = await getDB();
      department = req.query["department"]
      let deparmentClasses = await getDepartmentClasses(db, department);
      res.json(deparmentClasses);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

async function getDepartmentClasses(db, department) {
    let query = "TODO: Need to get all of the classes for a given department";
    let rows = await db.query(query);
    return rows;
  }

/**
* Query to get all of classes taught by professor for 
*     all of the professors in a department
 */

app.get("/departments/professors", async (req, res) => {
    let db;
    try {
      db = await getDB();
      department = req.query["department"]
      let professorClasses = await getDepartmentProfessors(db, department);
      res.json(professorClasses);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

async function getDepartmentProfessors(db, department) {
    let query = "TODO: Query to get all of classes taught by professor for all of the professors in a department";
    let rows = await db.query(query);
    return rows;
  }

/**
  * Query from classes table in a department without description with location and 
  *     sections from classes and sections
 */

// Design decision: do we get all of the classes in a department first?
// Or do we get all of the classes in general?
app.get("/classes-current", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let currentClasses = await getDepartmentClasses(db);
      res.json(currentClasses);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

async function getDepartmentClasses(db) {
    let query = "TODO: Query from classes table in a department without description with location and sections from classes and sections";
    let rows = await db.query(query);
    return rows;
  }

/**
 * Query from classes to get reviews for every class in a department
 */

app.get("/departments/reviews", async (req, res) => {
    let db;
    try {
      db = await getDB();
      department = req.query["department"]
      let departmentReviews = await getDepartmentReviews(db, department);
      res.json(departmentReviews);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

async function getDepartmentReviews(db, department) {
    let query = "TODO: Query from classes to get reviews for every class in a department";
    let rows = await db.query(query);
    return rows;
  }

/**
  * Query to get all of the classes the student has taken from registered
 */

app.get("/student/classes", async (req, res) => {
    let db;
    try {
      db = await getDB();
      let userid = req.cookies.userid
      let studentClasses = await getStudentCredits(db, userid);
      res.json(studentClasses);
    } catch (error) {
      res.type("text");
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
    if (db) {
      db.end();
    }
  });

async function getStudentCredits(db, userid) {
    let query = "TODO: query to get how many credits student has taken in each department";
    let rows = await db.query(query);
    return rows;
  }

/*---- INSERT queries ------*/

/**
 * Queries to add classes for students who signed up
 * Queries add classes to departments
 * Queries to add students to user_info
 */

app.post("/students/register", async (req, res, next) => {
    let qid = req.body.qid;
    if (!qid) {
      res.status(CLIENT_ERR_CODE);
      next(Error("Missing required qid."));
    } else {
      let db;
      try {
        db = await getDB();
        let successfulResult = await removeFromQueue(qid, db);
        db.end();
        if (successfulResult) {
          res.type("text");
          res.send("Successfully removed from queue!");
        } else {
          res.status(CLIENT_ERR_CODE);
          next(Error("No entry found for given qid."));
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

app.post("/add-classes", async (req, res, next) => {
    let qid = req.body.qid;
    if (!qid) {
      res.status(CLIENT_ERR_CODE);
      next(Error("Missing required qid."));
    } else {
      let db;
      try {
        db = await getDB();
        let successfulResult = await removeFromQueue(qid, db);
        db.end();
        if (successfulResult) {
          res.type("text");
          res.send("Successfully removed from queue!");
        } else {
          res.status(CLIENT_ERR_CODE);
          next(Error("No entry found for given qid."));
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

app.post("/add-students", async (req, res, next) => {
    let qid = req.body.qid;
    if (!qid) {
      res.status(CLIENT_ERR_CODE);
      next(Error("Missing required qid."));
    } else {
      let db;
      try {
        db = await getDB();
        let successfulResult = await removeFromQueue(qid, db);
        db.end();
        if (successfulResult) {
          res.type("text");
          res.send("Successfully removed from queue!");
        } else {
          res.status(CLIENT_ERR_CODE);
          next(Error("No entry found for given qid."));
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

/*---- UPDATE queries ------*/

/**
 * Queries to update courses offered
 */

/*---- DELETE queries ------*/

/**
 * Queries to delete courses offered
 */

/**
 * Login
 */

app.post("/login", checkLogin, async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!(username && password)) {
    res.status(CLIENT_ERR_CODE);
    next(Error("Missing password or username"));
  } else {
    let db;
    try {
      db = await getDB(); // don't establish connection until we need to.
      let userid = await authenticateUser(username, password, db);
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

async function authenticateUser(username, password, db) {
  let procedure = "CALL PROCEDURE ...";
  let result = await db.query(procedure, [username, password]);
  return result;
}

app.post("/signup", checkLogin, async (req, res, next) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let password = req.body.password;
  if (!(firstName && lastName && username && password)) {
    res.status(CLIENT_ERR_CODE);
    next(Error("Missing information"));
  } else {
    let db;
    try {
      db = await getDB(); // don't establish connection until we need to.
      let userid = await addNewUser(firstName, lastName, username, password, db);
      if (userid) {
        res.type("text");
        res.send(`Successfully created account!`);
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

async function addNewUser(firstName, lastName, username, password, db) {
  let procedure = "CALL PROCEDURE ...";
  let result = await db.query(procedure, [firstName, lastName, username, password]);
  return result;
}

function checkLogin(req, res, next) {
  if (req.cookies["logged_in"] && req.cookies.userid) {
    res.type("text");
    res.send(`Welcome back to Tration!`);
  } else {
    next();
  }
}

async function getDB() {
  let db = await mysql.createConnection({
    // Variables for connections to the database.
    host: "localhost",      
    port: "8889",          
    user: "appclient",         
    password: "clientpw",    
    database: "tration"    
  });
  return db;
}

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
