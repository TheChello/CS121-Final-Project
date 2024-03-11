"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
const mysql = require("promise-mysql");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt"); // for optional password hashing; see brcrypt docs

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

/*---- SELECT queries ------*/



/*---- INSERT queries ------*/



/*---- UPDATE queries ------*/



/*---- DELETE queries ------*/



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
