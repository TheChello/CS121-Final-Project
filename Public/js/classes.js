/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for index.html - a website for selling and buying 
 * used goods. This file handles initializing the index page, as well as links
 * to products
 */

 (function() {
    "use strict";
    
    const BASE_URL = "/";

    /**
     * This function initializes the home page by initializing the category bar
     * then populating the screen with the products.
     */
    function init() {
        createNavigationBar();
        let location = window.location.toString().split("?")[1];
        let department = location.split("=")[1];
        console.log(department);
        initClassesDisplay(department);
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function initClassesDisplay(department) {
        try {
            let url = BASE_URL + `departments/classes?department=${department}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateClassesList(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Takes a JSON list of products, and for individual products, creates
     * a product view and adds it to the display
     * @param {Object} productLst - a list of products in JSON form
     */
    function populateClassesList(classLst) {
        id("department-classes").innerHTML = "";
        classLst.forEach((classItem) => {
            let newClass = createElem(classItem);
            id("department-classes").appendChild(newClass);
        });
    }

    /**
     * Creates a product element to be added to home page given information
     * in JSON format. Adds images, prices, and name of the product
     * @param {Object} productInfo - product information in JSON format
     * @returns {Object} - A div object to be added to screen
     */
    function createElem(classInfo) {
        let classDiv = gen("div");

        let classID = gen("h1");
        classID.textContent = classInfo.class_id;
        classDiv.appendChild(classID);

        let className = gen("h2");
        className.textContent = classInfo.class_name;
        classDiv.appendChild(className);

        let classUnits = gen("h3");
        classUnits.textContent = "Term " + classInfo.term + " | " + " Credits " + classInfo.credits;
        classDiv.appendChild(classUnits);

        let prereqs = gen("h4");
        prereqs.textContent = classInfo.prereq;
        classDiv.appendChild(prereqs);

        let description = gen("p");
        description.textContent = classInfo.overview;
        classDiv.appendChild(description);

        let instructor = gen("h2");
        instructor.textContent = classInfo.professor_id;
        classDiv.appendChild(instructor);

        let keywords = gen("h2");
        keywords.textContent = classInfo.keywords;
        classDiv.appendChild(keywords);

        return classDiv;
    }

    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        let text = gen("h2");
        text.textContent = errMsg;
        id("product-display").appendChild(text);
    }

    init();

})();