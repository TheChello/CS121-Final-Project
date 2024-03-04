"""
Student name(s): Yunha Jo, Shrey Srivastava
Student email(s): yjo@caltech.edu, ssrivas2@caltech.edu
This program details funcitons that will be used for client access
"""
import sys  
import mysql.connector
import mysql.connector.errorcode as errorcode

DEBUG = False


# ----------------------------------------------------------------------
# SQL Utility Functions
# ----------------------------------------------------------------------
def get_conn():
    """"
    Returns a connected MySQL connector instance, if connection is successful.
    If unsuccessful, exits.
    """
    try:
        conn = mysql.connector.connect(
          host='localhost',
          user='student',
          port='3306',  
          password='studentpw',
          database='regisdb' 
        )
        print('Successfully connected.')
        return conn
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR and DEBUG:
            sys.stderr('Incorrect username or password when connecting to DB.')
        elif err.errno == errorcode.ER_BAD_DB_ERROR and DEBUG:
            sys.stderr('Database does not exist.')
        elif DEBUG:
            sys.stderr(err)
        else:
            sys.stderr('An error occurred, please contact the administrator.')
        sys.exit(1)

# ----------------------------------------------------------------------
# Functions for Command-Line Options/Query Execution
# ----------------------------------------------------------------------
def get_classes_in_department(department_name):
    param1 = department_name
    cursor = conn.cursor()
    sql = 'SELECT class_id FROM departments WHERE department_name = \'%s\';' % (param1, )
    try:
        cursor.execute(sql)
        rows = cursor.fetchall()
        students = []
        for row in rows:
            (col1val) = (row)
            students.append(col1val)
            print(col1val)
    except mysql.connector.Error as err:
        if DEBUG:
            sys.stderr(err)
            sys.exit(1)
        else:
            sys.stderr('An error occurred, check that you have passed in the correct department name')

def get_students_in_class(class_id):
    param1 = class_id
    cursor = conn.cursor()
    sql = 'SELECT name FROM registered JOIN students WHERE class_id = \'%s\';' % (param1, )
    try:
        cursor.execute(sql)
        rows = cursor.fetchall()
        students = []
        for row in rows:
            (col1val) = (row)
            students.append(col1val)
            print(col1val)
    except mysql.connector.Error as err:
        if DEBUG:
            sys.stderr(err)
            sys.exit(1)
        else:
            sys.stderr('An error occurred, check that you have passed in the correct class id')

def get_classes_by_keywords():
    print("To be defined")
    pass

def registered():
    print("To be defined")
    pass

def get_classes_this_term():
    print("To be defined")
    pass

# ----------------------------------------------------------------------
# Functions for Logging Users In
# ----------------------------------------------------------------------
# Not Applicable as we will separate out client and admin


# ----------------------------------------------------------------------
# Command-Line Functionality
# ----------------------------------------------------------------------
def show_options():
    """
    Displays options users can choose in the application, such as
    viewing <x>, filtering results with a flag (e.g. -s to sort),
    sending a request to do <x>, etc.
    """
    print('What would you like to do? ')
    print('  (w) - Look at all of classes offered this term')
    print('  (e) - Look at all of classes in a department')
    print('  (r) - Register for classes this term')
    print('  (t) - Look up all students in a class')
    print('  (y) - Look up classes by keywords')
    print('  (u) - quit')
    print()
    ans = input('Enter an option: ').lower()
    if ans == 'q':
        quit_ui()
    elif ans == 'w':
        get_classes_this_term()
    elif ans == 'e':
        get_classes_in_department("computer science")
    elif ans == 'r':
        registered()
    elif ans == 't':
        get_students_in_class("CS 121")
    else:
        get_classes_by_keywords()



def quit_ui():
    """
    Quits the program, printing a good bye message to the user.
    """
    print('Good bye!')
    exit()


def main():
    """
    Main function for starting things up.
    """
    show_options()


if __name__ == '__main__':
    conn = get_conn()
    main()
