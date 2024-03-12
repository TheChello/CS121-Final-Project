/**
 * CS 132
 * Name: Yunha Jo
 * Data: June 11, 2023
 * Javascript functions for initializing the category bar
 * across all of the html pages
 */

 const NAVIGATION_BAR = ["Departments", "Professors", "Courses", "TQFRs", "MyClasses", "MyCredits"];
 
 /**
  * This function creates a category bar given categories in a list
  * @param {List} data - a JSON list of categories
  */
 function createNavigationBar() {
    let loggedIn = sessionStorage.getItem("logged-in");
    if (loggedIn == "True") {
        let navBar = generateCategoryBar(NAVIGATION_BAR);
        id("nav-category").innerHTML = "";
        id("nav-category").appendChild(navBar);
    }
    else {
        let navBar = generateCategoryBar(NAVIGATION_BAR.slice(0,4));
        id("nav-category").innerHTML = "";
        id("nav-category").appendChild(navBar);
    }
 }
 
 /**
  * This function creates a category bar given categories in a list
  * by creating a nav bar then adding items to it
  * @param {List} categories - a JSON list of categories
  */
 function generateCategoryBar(categories) {
     let list = gen("ul");
     categories.forEach(category => {
         let item = gen("li");
         item.id = category;
         let a = gen("a");
         let text = document.createTextNode(category);
         a.appendChild(text);
         if (category == "MyClasses" || category == "MyCredits") {
            a.href = category.toLowerCase() + ".html";
            item.appendChild(a);
            list.appendChild(item);
         }
         else if (category == "Courses") {
            a.href = "courses_offered.html";
            item.appendChild(a);
            list.appendChild(item);
         }
         else {
            a.href = "departments.html" + "?path=" + category.toLowerCase();
            item.appendChild(a);
            list.appendChild(item);
         }
     })
     return list;
 }

 function handleError(errMsg) {
    let text = gen("h2");
    text.textContent = errMsg;
    id("nav-category").appendChild(text);
}