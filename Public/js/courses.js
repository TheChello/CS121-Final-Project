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
        initCoursesDisplay();
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function initCoursesDisplay() {
        try {
            let url = BASE_URL + "classes-current";
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateCoursesView(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Takes a JSON list of products, and for individual products, creates
     * a product view and adds it to the display
     * @param {Object} productLst - a list of products in JSON form
     */
    function populateCoursesView(courseLst) {
        id("all-courses").innerHTML = "";
        courseLst.forEach((courseInfo) => {
            let newCourses = createElem(courseInfo);
            id("all-courses").appendChild(newCourses);
        });
    }

    /**
     * Creates a product element to be added to home page given information
     * in JSON format. Adds images, prices, and name of the product
     * @param {Object} productInfo - product information in JSON format
     * @returns {Object} - A div object to be added to screen
     */
    function createElem(courseInfo) {
        let courseDiv = gen("div");

        let classesID = gen("h2");
        classesID.textContent = courseInfo.class_id;
        courseDiv.appendChild(classesID);

        let classesName = gen("h2");
        classesName.textContent = courseInfo.class_name;
        courseDiv.appendChild(classesName);

        let location = gen("h2");
        location.textContent = courseInfo.class_location;
        courseDiv.appendChild(location);

        let classTime = gen("h2");
        classTime.textContent = courseInfo.class_time;
        courseDiv.appendChild(classTime);

        let classRecitation = gen("h2");
        classRecitation.textContent = courseInfo.recitation;
        courseDiv.appendChild(classRecitation);

        // let classCapacity = gen("h2");
        // classCapacity.textContent = courseInfo.capacity;
        // courseDiv.appendChild(classCapacity);

        let addButton = gen("button");
        addButton.id = courseInfo.class_id;
        addButton.textContent = "Add Class";
        addButton.addEventListener("click", addToCart);
        courseDiv.appendChild(addButton);

        return courseDiv;
    }

    async function addToCart() {
        let params = {class_id: this.id};
        try {
            let resp = await fetch(BASE_URL + "students/register", { 
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify(params)
            });
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        let text = gen("h2");
        text.textContent = errMsg;
        id("all-courses").appendChild(text);
    }

    init();

})();