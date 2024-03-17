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
        initReviewsDisplay(department);
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function initReviewsDisplay(department) {
        try {
            let url = BASE_URL + `departments/reviews?department=${department}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateReviewsList(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Takes a JSON list of products, and for individual products, creates
     * a product view and adds it to the display
     * @param {Object} productLst - a list of products in JSON form
     */
    function populateReviewsList(classLst) {
        id("classes-reviews").innerHTML = "";
        classLst.forEach((classItem) => {
            let newClass = createElem(classItem);
            id("classes-reviews").appendChild(newClass);
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

        let reviews = gen("p");
        reviews.textContent = "Reviews " + classInfo.review;
        classDiv.appendChild(reviews);

        let rating = gen("h2");
        rating.textContent = "Rating " + classInfo.rating;
        classDiv.appendChild(rating);

        return classDiv;
    }

    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        let text = gen("h2");
        text.textContent = errMsg;
        id("classes-reviews").appendChild(text);
    }

    init();

})();