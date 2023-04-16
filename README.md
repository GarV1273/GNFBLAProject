# FBLA CODING AND PROGRAMMING
## Authors: Nirmaha Mukherjee and Gavin Sutherland
## Missouri State Competition

### Here is the exact prompt
Develop a program that will help improve student involvement at your school.  This original computer program will track student participation and attendance at school events.  Once students participate or attend events, they are awarded points.  You must have a way to pick a random winner each quarter from each grade level, as well as the student with the top point accumulation.  The number of points a person has accumulated will translate to the prize they will win.  You will need to have at least three prizes (a school reward, a food reward, and a school spirit item).

- Assign a point value for participating in or attending events.
- Must have at least five sporting events and five non-sports school events.
- Track students’ names, grades, points.
- Generate a report at the end of the quarter to show points per student in each grade.
- Data must be stored persistently.  Storage may be in a relational database, a document-oriented NoSQL database, flat text files, flat JSON, or XFBLA Middle School files.
- The user interface must be a GUI with a minimum of five different control types including such things as drop-down lists, text fields, checkboxes, date picker, or other relevant control types.
- All data entry must be validated with appropriate user notification and error messages including the use of required fields.

### Stack
- Front-end: The user interaction will be done throught a website, so we will be using HTML, CSS, and JavaScript/TypeScript. We may add other libraries/frameworks, but this is our baseline.
  - We used a free mdbootstrap landing page template for the index and the NiceAdmin template for user GUI.
- Back-end: We will be using ejs and node.js to interact with th databse and do the form processing.
- Database: We used a MongoDB cluster to store the data.

### Requirements
- Administrators can login to an account. Each administrotor is attached to a school. 
- Administrators can add events and assign point values to them.
- Administrators can add students to their school.
- Administrators can add students to events.
- Administrators can view a report of the points each student has.
- Administrators can view a report of the points each student has in each grade.
- Administrators can view a report of the prize winners. The winners are specified in the prompt.
- Administrators can edit event details

