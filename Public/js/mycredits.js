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
        initMyCreditsDisplay();
    }
    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
     async function initMyCreditsDisplay() {
        try {
            let url = BASE_URL + "student/credits";
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateClassesView(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Takes a JSON list of products, and for individual products, creates
     * a product view and adds it to the display
     * @param {Object} productLst - a list of products in JSON form
     */
    function populateClassesView(courseLst) {
        id("courses-taken").innerHTML = "";
        courseLst.forEach((courseInfo) => {
            let newCourses = createElem(courseInfo);
            id("courses-taken").appendChild(newCourses);
        });
    }

    /**
     * Creates a product element to be added to home page given information
     * in JSON format. Adds images, prices, and name of the product
     * @param {Object} productInfo - product information in JSON format
     * @returns {Object} - A div object to be added to screen
     */
    function createElem(creditInfo) {
        let courseDiv = gen("div");

        let dptName = gen("h2");
        dptName.textContent = creditInfo.department_name;
        courseDiv.appendChild(dptName);

        let credits = gen("h2");
        credits.textContent = creditInfo.total_credits;
        courseDiv.appendChild(credits);


        return courseDiv;
    }

    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        let text = gen("h2");
        text.textContent = errMsg;
        id("courses-taken").appendChild(text);
    }

    init();

})();