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
        initProductDisplay();
    }

    /**
     * Makes a fetch call to the API to get all of the products, then
     * calls a function to populate the product display.
     */
    async function initProductDisplay() {
        let loggedIn = sessionStorage.getItem("logged-in");
        console.log(loggedIn);
        if (loggedIn == "True") {
            id("important-links").innerHTML = "";
            let link1 = gen("div");
            let text1 = gen("h2");
            let textLink1 = gen("h2");
            text1.textContent = "View and Sign Up for Classes"
            textLink1.textContent = "Current Couses"
            textLink1.href = "courses_offered.html";
            link1.appendChild(text1)
            link1.appendChild(textLink1)
            id("important-links").appendChild(link1);

            let link2 = gen("div");
            let text2 = gen("h2");
            let textLink2 = gen("h2");
            text2.textContent = "View my Classes for Current Term"
            textLink2.textContent = "MyClasses"
            textLink2.href = "myclasses.html";
            link2.appendChild(text2)
            link2.appendChild(textLink2)
            id("important-links").appendChild(link2);

            let link3 = gen("div");
            let text3 = gen("h2");
            let textLink3 = gen("h2");
            text3.textContent = "View my Current Credits"
            textLink3.textContent = "MyCredits"
            textLink3.href = "MyCredits.html";
            link3.appendChild(text3)
            link3.appendChild(textLink3)
            id("important-links").appendChild(link3);
        }
        else {
            id("important-links").innerHTML = "";
            let text = gen("h2");
            text.textContent = "Please log in to access your classes";
            id("important-links").appendChild(text);
        }
    }

    init();

})();