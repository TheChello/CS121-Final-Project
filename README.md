# CS121FinalProject: Tration
# Yunha Jo and Shrey Srivastava

# *NOTE REGARDING ORDER OF RUNNING FILES: 
While the implementation of all the files does all for you to utilize the 
default given to us, we have abstracted it away for your convenience. Simply
by running reset.sql, you will be able to (assuming you haven't already) 
"reset" running all the necessary commands from creating the database, 
to filling it in with data, and setting up permissions and routines. 

** Special caveat: queries.sql will not be included within reset.sql, as we
wanted this to be directly tied to all files needed for database operation, 
and queries.sql, is just a way to interact with the database and is not 
very crucial. As such, you will still need to run this manually to get the 
proper results. 

# Running the Files
## Short Commands:
1. Run 'source reset.sql;' - this will set up the whole database
2. Run 'node-mysql.js'
## Long Commands:
1. Run create database tration;
2. Run use tration;
3. Run source setup.sql;
4. Run source load-data.sql;
5. Run source setup-passwords.sql;
6. Run source setup-routines.sql;
7. Run source grant-permissions.sql;
8. Run node-mysql.js

# Website Flow:
For the website, there are four public pages that you can without logging in.
Classes in each department, courses offered, reviews for each department, and
courses taught by professors in each department. For the personal pages,
you can log in on the login page, or you can add yourself as a user on Create Account
page. Once you have logged in properly, you should see two more pages
called MyCredits and MyClasses, which shows the classes that the logged in
user has registered for and number of credits in each department that the student
has taken.


# Data for load.sql
The data was part random generation, part taken from REGIS publicly available
data. Early on in our project, we realized that given the custom fields we
wanted in our tables, we would need to hand parse some of the information to
get it in the right format. This mean taking a sizeable quantity of courses
from REGIS with all of its corresponding information: time, credits, location, 
etc. Additinally, as we were translating these by hand, some minor details 
may be shifted for the ease of building the database (for example, CS 003 
is the only class within out database with multiple sections for the sake
of an example). For the randomly generated data, this includes most of 
student related information that is private, as well as some arbritarily
decided fields: review, rating, etc. 

Additonally, you will likely notice that 
within load, we only load in departments, professors, classes, and sections. 
Meanwhile, we still have 3 other tables, user_infos, students, and registered.
This was done on purpose, as we realized that due to us deciding to hash 
usernames as well, and equating user_ids to student_ids for students, we
would want to build those tables up via adding them as a user. This allowed 
us to connect those two tables in a seamless manner, and we left registered
empty to start with, with many triggers and other routines in place to allow
for an easy way to fill in registered. The website also allows you to "sign
in" as one of the users added within load, after which you can register!


# Unfinished Features + Stretch Goals
1. Admin user permissions were given, but not explicity used within queries
or other website functionality 
2. Change password is provided as functinality (implemented in code), just
not given an interface to be used in 
3. Keywords, given as a singular word for now, was more of a stretch goal due
to the inherent difficulty to search based on a list of keywords. 
