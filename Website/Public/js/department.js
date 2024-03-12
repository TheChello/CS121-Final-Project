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
        initDepartmentDisplay();
    }

    function initDepartmentDisplay() {
        id("department-links").innerHTML = "";
        let lst = gen("ul");
        lst.id = "department-list";
        let location = window.location.toString().split("?")[1];
        let category = location.split("=")[1];
        getAllDepartments(category);
    }
    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function getAllDepartments(category) {
        try {
            let url = BASE_URL + "departments";
            let resp = await fetch(url);
            resp = checkStatus(resp);
            const data = await resp.json();
            displayDepartments(data, category);
        } catch (err) {
            handleError(err);
        }
    }

    function displayDepartments(departmentLst, category) {
        let lst = id("department-list");
        departmentLst.forEach((department) => {
            let item = gen("li");
            let a = gen("a");
            let text = document.createTextNode(category);
            a.appendChild(text);
            a.ref = category.toLowerCase() + "_department.html?department=" + department;
            a.appendChild(text);
            lst.appendChild(item);
        });
    }


    /**
     * Displays the error message to the user
     * @param {String} errMsg - error message in string format
     */
    function handleError(errMsg) {
        let text = gen("h2");
        text.textContent = errMsg;
        id("department-links").appendChild(text);
    }

    init();

})();