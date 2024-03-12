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
        id("signup-button").addEventListener("click", signUp);
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function signUp() {
        let params = {firstName: qs("input[name='first-name']").value,
        lastName: qs("input[name='last-name']").value,
        username: qs("input[name='username']").value, 
        password: qs("input[name='password']").value,};

    try {
        let resp = await fetch(BASE_URL + "signup", { 
            headers: {
                "Content-Type": "application/json",
            },
            method : "POST",
            body : JSON.stringify(params)
        });
        resp = checkStatus(resp);
        sessionStorage.setItem('login', 'True');
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
        id("product-display").appendChild(text);
    }

    init();

})();