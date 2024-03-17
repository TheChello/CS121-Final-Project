/*
 * CS 121 Winter 2024
 * Javascript functions for REGIS-based website. These functions handle creating
 * accounts for users
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
        let firstname = qs("input[name='first-name']").value;
        let lastname = qs("input[name='last-name']").value;
        let username = qs("input[name='username']").value;
        let password = qs("input[name='password']").value;
        let grade = id("grade").value;
        let major = qs("input[name='major']").value;

        let params = {firstName: firstname,
            lastName: lastname,
            username: username, 
            password: password,
            grade: grade,
            major: major
            };
        try {
            let resp = await fetch(BASE_URL + "signup", { 
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify(params)
            });
            resp = checkStatus(resp);
            const msg = await resp.text();
            console.log(msg);
            let text = gen("h2");
            text.textContent = msg;
            id("create-account").appendChild(text);
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
        id("create-account").appendChild(text);
    }

    init();

})();