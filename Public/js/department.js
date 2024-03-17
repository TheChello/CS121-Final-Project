/*
 * CS 121 Winter 2024
 * Javascript functions for REGIS-based website. These functions handle showing
 * departments in database
 */

 (function() {
    "use strict";
    
    const BASE_URL = "/";
    // const tmpDept = ["CS", "ACM", "IDS"]

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
        id("department-links").appendChild(lst)
        let location = window.location.toString().split("?")[1];
        let category = location.split("=")[1];
        // getAllDepartments(category);
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
            let text = document.createTextNode(department);
            a.appendChild(text);
            let tmp = department.replaceAll(" ", "_");
            a.href = category.toLowerCase() + "_department.html?department=" + tmp;
            a.appendChild(text);
            item.appendChild(a)
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