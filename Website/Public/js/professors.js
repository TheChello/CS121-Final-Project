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
        initProfessorsDisplay(department);
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function initProfessorsDisplay(department) {
        try {
            let url = BASE_URL + `departments/professors?department=${department}`;
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            populateProfessorList(data);
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Takes a JSON list of products, and for individual products, creates
     * a product view and adds it to the display
     * @param {Object} productLst - a list of products in JSON form
     */
    function populateProfessorList(professorLst) {
        id("department-professors").innerHTML = "";
        professorLst.forEach((professorItem) => {
            let professorDiv = createElem(professorItem);
            id("department-professors").appendChild(professorDiv);
        });
    }

    /**
     * Creates a product element to be added to home page given information
     * in JSON format. Adds images, prices, and name of the product
     * @param {Object} productInfo - product information in JSON format
     * @returns {Object} - A div object to be added to screen
     */
    function createElem(professorInfo) {
        let professorDiv = gen("div");

        let professorName = gen("h1");
        professorName.textContent = professorInfo.professor_name;
        professorDiv.appendChild(professorName);

        let classesName = gen("h2");
        classesName.textContent = professorInfo.class_name;
        classDiv.appendChild(classesName);

        return professorDiv;
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