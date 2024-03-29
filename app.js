const express = require('express');
const fs = require('fs');
const path = require('path');
const app = new express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Teacher = require('./models/Teacher.js');
const Event = require('./models/Event.js');
const School = require("./models/School.js");
const Student = require("./models/Student.js");
global.signedInUser;

const username = encodeURIComponent('fbla');
const password = encodeURIComponent('Xtxg5EnaFVHoQ9Xs');
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.w6jnzm3.mongodb.net/userData`, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * @method
 * @name listener
 * @description Starts the server by listening to the port 3000 for requests.
 */
app.listen(3000, () => {
    console.log("listening on port 3000");
});

/**
 * @method
 * @name mainSite_GET
 * @description Renders the main screen of the site which includes the login/register modal.
 */
app.get("/FBLA", (req, res) => {
    res.render('index');
});

/**
 * @method
 * @name dashboard_GET
 * @description Renders the dashboard and is activated when the teacher has logged in.
 */
app.get("/FBLA/dashboard", async (req, res) => {
    // Renders the dashboard
    // This block appears quite often. It is used to get the events for the school
    let schoolEvents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.events.length; i++) {
        let event = await Event.findById(school.events[i]);
        schoolEvents.push(event);
    }
    res.render('dashboard', {
        signedInUser,
        schoolEvents
    });
});

/**
 * @method
 * @name events_GET
 * @description Gets all the events from the school and renders the events page
 */
app.get("/FBLA/events", async (req, res) => {
    // Get all the events for the school. Similar to dashboard but is handled differently in the ejs
    let schoolEvents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.events.length; i++) {
        let event = await Event.findById(school.events[i]);
        schoolEvents.push(event);
    }
    res.render('events', {
        schoolEvents
    });
});

/**
 * @method
 * @name addEvent_GET
 * @description Renders the form for adding an event.
 */
app.get("/FBLA/addEvent", (req, res) => {
    res.render('addEvent');
});

/**
 * @method
 * @name editEvent_GET
 * @description Renders the page for editing an event. Passes in all the events associated with the school into the frontend.
 */
app.get("/FBLA/editEvent", async (req, res) => {
    // Gets all of the events for the school and renders them as a dropdown. The user can then select an event to edit
    let schoolEvents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.events.length; i++) {
        let event = await Event.findById(school.events[i]);
        schoolEvents.push(event);
    }
    res.render('editEvent', {
        schoolEvents,
    });
});

/**
 * @method
 * @name assignPoints_GET
 * @description Renders the form for assigning points to students. Passes in all the students and events associated with the school into the frontend.
 */
app.get("/FBLA/assign-points", async (req, res) => {
    // Same event dropdown as editEvent, but it also renders the grades and converts them to radio buttons
    let schoolEvents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.events.length; i++) {
        let event = await Event.findById(school.events[i]);
        schoolEvents.push(event);
    }

    let schoolStudents = [];
    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    res.render('assignPoints', {
        schoolEvents,
        schoolStudents
    });
});

/**
 * @method
 * @name reports_GET
 * @description Renders the page for generating reports on student data. Passes in a list of grades and students associated with the school into the frontend.
 */
app.get("/FBLA/reports", async (req, res) => {
    // Generates a list of every student. This is only called when the page is accessed. This will not run when you use the filter. For that function, see the post request below
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    let displayedStudents = schoolStudents; // Display every student until a filter is applied

    res.render('reports', {
        displayedStudents,
        grades
    });
});

/**
 * @method
 * @name addStudent_GET
 * @description Renderds the page for adding students to the school.
 */
app.get('/FBLA/add-student', async (req, res) => {
    res.render('addStudent');
});

/**
 * @method
 * @name editStudent_GET
 * @description Renders the page for editing students. Passes in a list of students associated with the school into the frontend.
 */
app.get('/FBLA/edit-student', async (req, res) => {
    // Same as editEvent, but it renders the students instead of the events
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }
    res.render('editStudent', {
        schoolStudents
    });
});

/**
 * @method
 * @name removeStudent_GET
 * @description Renders the page for removing students. Passes in a list of students associated with the school into the frontend.
 */
app.get('/FBLA/remove-student', async (req, res) => {
    // Same as editEvent, but it renders the students instead of the events
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }
    res.render('removeStudent', {
        schoolStudents
    });
});

/**
 * @method
 * @name winner_GET
 * @description Renders the page for generating winners. It gets a list of all students and filters them by grades and selects random and overall winners from each grade. It then generates prizes for them based on how many points they scored. The winners list is then passed into the frontend.
 */
app.get("/FBLA/winner", async (req, res) => {
    // Generates a list of students from the school and sorts them by grade level. Then, it selects the student with the highest points overall from the school as well as random winners from each grade level
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    let gradesStudents = []; // Students sorted by grade level

    // Sorts the students by grade level
    for (let i = 0; i < grades.length; i++) {
        let students = schoolStudents.filter(function (el) {
            return el.grade === grades[i];
        });
        gradesStudents.push(students);
    };

    allWinners = []; // This will hold all of the winners

    // Basic sorting algorithm to select the student with the highest points overall from the school
    let highestPointsStudent = null;
    let highestPoints = -Infinity;

    for (let i = 0; i < schoolStudents.length; i++) {
        if (schoolStudents[i].points > highestPoints) {
            highestPoints = schoolStudents[i].points;
            highestPointsStudent = schoolStudents[i];
        }
    };

    // The data must be converted to a JSON object in order to be manipulated. MongoDB does not allow you to add new properties to a document object without modifying the database.
    highestPointsStudent = JSON.parse(JSON.stringify(highestPointsStudent));
    // Add the reason for winning to the student object. This will be displayed on the winner page
    highestPointsStudent["reason"] = "Overall Winner";

    // Get the prize. This could be converted to a loop, but this was easier to implement. If more prizes are added, this will need to be modified for conciseness
    if (highestPointsStudent.points >= 250) {
        highestPointsStudent["prize"] = "2 Free Prom Tickets OR a Free Yearbook";
    } else if (highestPointsStudent.points >= 200) {
        highestPointsStudent["prize"] = "School Hoodie";
    } else if (highestPointsStudent.points >= 100) {
        highestPointsStudent["prize"] = "School T-Shirt";
    } else if (highestPointsStudent.points >= 40) {
        highestPointsStudent["prize"] = "King Size Candy Bar";
    } else {
        highestPointsStudent["prize"] = "Candy Bar";
    }

    allWinners.push(highestPointsStudent);

    // Using the gradesStudents array, select a random student from each grade level.
    // It will be added to the allWinners array
    let currentGrade = null;
    let randomWinner = null;

    for (let i = 0; i < gradesStudents.length; i++) {
        currentGrade = gradesStudents[i];
        randomWinner = currentGrade[Math.floor(Math.random() * currentGrade.length)];
        
        // If there are no students in the grade, randomWinner will be undefined. This will cause an error when the JSON object is parsed. This will skip the grade if there are no students in it
        if (randomWinner == undefined) {
            continue;
        }
        randomWinner = JSON.parse(JSON.stringify(randomWinner));
        // Award prizes to the random winners from the prizes object
        if (randomWinner.points >= 250) {
            randomWinner["prize"] = "2 Free Prom Tickets OR a Free Yearbook";
        } else if (randomWinner.points >= 200) {
            randomWinner["prize"] = "School Hoodie";
        } else if (randomWinner.points >= 100) {
            randomWinner["prize"] = "School T-Shirt";
        } else if (randomWinner.points >= 40) {
            randomWinner["prize"] = "King Size Candy Bar";
        } else {
            randomWinner["prize"] = "Candy Bar";
        }

        // Add the reason for winning to the student object. This will be displayed on the winner page
        randomWinner["reason"] = "Random Winner (Grade " + grades[i] + ")";
        allWinners.push(randomWinner);

    }

    res.render('winner', {
        allWinners
    });
});

/**
 * @method
 * @name addStudent_POST
 * @description Adds a new student to the database based on form data
 */
app.post('/FBLA/AddStudent', async (req, res) => {
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let student = await Student.create(req.body);
    Student.findByIdAndUpdate(student._id, {"points": 0}, (err, student) => {
        if (err) throw err;
    });
    School.findByIdAndUpdate(school._id, { $push: { students: student._id } }, (err, schoolEvnt) => {
        if (err) throw err;
        res.redirect('/FBLA/add-student');
    });
});

/**
 * @method
 * @name editStudent_POST
 * @description Modifys an existing student based on form data.
 */
app.post('/FBLA/EditStudent', async (req, res) => {
    let student = await Student.findOne({studentId: req.body.studentId});
    Student.findByIdAndUpdate(student._id, req.body, (err, student) => {
        if (err) throw err;
        res.redirect('/FBLA/edit-student');
    });
});

/**
 * @method
 * @name removeStudent_POST
 * @description Removes a student from the database
 */
app.post('/FBLA/RemoveStudent', async (req, res) => {
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let student = await Student.findOne({studentId: req.body.studentId});
    School.findByIdAndUpdate(school._id, { $pull: { students: student._id } }, (err, schoolEvnt) => {
        if (err) throw err;
        Student.findByIdAndDelete(student._id, (err, student) => {
            if (err) throw err;
            res.redirect('/FBLA/remove-student');
        });
    });
});

/**
 * @method
 * @name reports_POST
 * @description Same as the normal GET request but with a grade filter.
 */
app.post("/FBLA/reports", async (req, res) => {
    // Same function as above, but it filters the students based on the grade selected
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let selectedGrade = req.body.grade;

    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    let displayedStudents = schoolStudents.filter(function (el) {
        return el.grade === parseInt(selectedGrade);
    });

    res.render('reports', {
        displayedStudents,
        grades
    });
});

/**
 * @method
 * @name addEvent_POST
 * @description Adds an event to the database. The event is linked to only one school.
 */
app.post("/FBLA/AddEvent", (req, res) => {
    // Adds the event to the database and adds the event to the school's events array
    Teacher.findById(signedInUser._id, (err, data) => {
        if (err) throw err;
        School.findById(data.schoolId, (error, school) => {
            Event.create(req.body, (err, event) => {
                School.findByIdAndUpdate(school._id, { $push: { events: event._id } }, (er, schoolEvnt) => {
                    if (er) throw er;
                });
                res.redirect('/FBLA/events'); // Sends the user back to the events page so they can see the new event
            });
        });
    });
});

/**
 * @method
 * @name editEvent_POST
 * @description Modifys an existing event based on form data.
 */
app.post("/FBLA/EditEvent", async (req, res) => {
    // If they did not select the event, redirect them back to the events page
    if (req.body.selectedId == "none") {
        res.redirect('/FBLA/events');
        return;
    }
    let editedEvent = await Event.findByIdAndUpdate(req.body.selectedId, req.body); // The variable is not used. This is just to update the event in the database
    res.redirect('/FBLA/events');
});

/**
 * @method
 * @name signUp_POST
 * @description Registers a new user. If the school exists, add the teacher to the school.
 */
app.post("/FBLA/SignUp", async (req, res) => {
    // This creates a new user and a new school if the school does not exist
    let data = req.body;
    let school = await School.findOne({ name: data.school });
    if (school != null) { // If the school exists, set the schoolId to the school's id
        data.schoolId = school._id;
    }
    else { // Create a new school
        data.schoolId = (await School.create({ name: data.school }))._id;
    }
    Teacher.findOne({ email: data.email }, (error, user) => {
        if (user) { // If the username is already taken, redirect them back to the home page
            res.redirect('/FBLA');
        }
        else if (data.confirmPassword === data.password) { // If the passwords match, create the user
            Teacher.create(data, (error, args) => {
                if (error) throw error;
                res.redirect('/FBLA');
            });
        }
        else { // This should only run if the passwords do not match. We move this to javascript verification if time permits
            res.redirect('/FBLA');
        }
    });
});

/**
 * @method
 * @name login
 * @description Verifies that the user exists and has the correct password. Once confirmed, the user info is contained in a global variable.
 */
app.post("/FBLA/Login", async (req, res) => {
    // Simple login function
    const { email, password } = req.body;

    // Find the teacher in the database
    Teacher.findOne({ email: email }, (error, user) => {
        if (user) { // If they exist, compare the passwords
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) { // Log them in and redirect them to the dashboard
                    res.redirect('/FBLA/dashboard');
                    signedInUser = user;
                }
                else { // If the passwords do not match, redirect them back to the home page
                    res.redirect('/FBLA');
                }
            });
        }
        else { // If the user does not exist, redirect them back to the home page
            res.redirect('/FBLA');
        }
    });
});

/**
 * @method
 * @name assignPoints_POST
 * @description Adds the points from an event to a student.
 */
app.post("/FBLA/AssignPoints", async (req, res) => {
    if (req.body.name == "none") { // If they did not select an event, redirect them back to the assign points page
        res.redirect('/FBLA/assign-points');
        return;
    }
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let event = await Event.findOne({ name: req.body.name });
    let student = await Student.findOne({studentId: req.body.studentId});
    let studentId = student._id;
    let numPoints = student.points + event.points;
    Student.findByIdAndUpdate(studentId, { "points": numPoints, $push: {attendedEvents: event._id}}, (err, data) => {
        if (err) throw err;
        res.redirect('/FBLA/assign-points');
    });
});