/*
 * CS 121 Winter 2024
 * Javascript functions for REGIS-based website. These functions handle
 * logging in users
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
        id("login-button").addEventListener("click", login);
        id("logout-button").addEventListener("click", logout);
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function login() {
        let params = {username: qs("input[name='username']").value, 
        password: qs("input[name='password']").value,};

        try {
            console.log("inside login");
            let resp = await fetch(BASE_URL + "login", { 
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
            id("login-form").appendChild(text);
            sessionStorage.setItem('logged-in', 'True');
        } catch (err) {
            handleError(err);
        }
    }

    async function logout() {
        try {
            console.log("inside login");
            let resp = await fetch(BASE_URL + "logout", { 
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify({})
            });
            resp = checkStatus(resp);
            const msg = await resp.text();
            console.log(msg);
            let text = gen("h2");
            text.textContent = msg;
            id("login-form").appendChild(text);
            sessionStorage.setItem('logged-in', 'False');
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
        id("login-form").appendChild(text);
    }

    init();

})();