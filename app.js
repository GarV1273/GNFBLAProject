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

app.listen(3000, () => {
    console.log("listening on port 3000");
});

app.get("/FBLA", (req, res) => {
    res.render('index');
    console.log("rendered");
});

app.get("/FBLA/dashboard", async (req, res) => {
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

app.get("/FBLA/events", async (req, res) => {
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
    console.log("rendered");
});

app.get("/FBLA/addEvent", (req, res) => {
    res.render('addEvent');
    console.log("rendered");
});

app.get("/FBLA/editEvent", async (req, res) => {
    let schoolEvents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.events.length; i++) {
        let event = await Event.findById(school.events[i]);
        schoolEvents.push(event);
    }
    res.render('editEvent', {
        schoolEvents
    });
    console.log("rendered");
});

app.get("/FBLA/assign-points", async (req, res) => {
    let schoolEvents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.events.length; i++) {
        let event = await Event.findById(school.events[i]);
        schoolEvents.push(event);
    }

    grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    res.render('assignPoints', {
        schoolEvents,
        grades
    });
    console.log("rendered");
});

app.get("/FBLA/reports", async (req, res) => {
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    // let gradesStudents = [];

    // for (let i = 0; i < grades.length; i++) {
    //     let students = schoolStudents.filter(function (el) {
    //         return el.grade === grades[i];
    //     });
    //     gradesStudents.push(students);
    // }

    // console.log(gradesStudents);

    let displayedStudents = schoolStudents;

    res.render('reports', {
        displayedStudents,
        grades
    });
    console.log("rendered");
});

app.post("/FBLA/reports", async (req, res) => {
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let selectedGrade = req.body.grade;
    console.log(selectedGrade);

    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    console.log(schoolStudents);

    // let gradesStudents = [];

    // for (let i = 0; i < grades.length; i++) {
    //     let students = schoolStudents.filter(function (el) {
    //         return el.grade === grades[i];
    //     });
    //     gradesStudents.push(students);
    // }

    let displayedStudents = schoolStudents.filter(function (el) {
        return el.grade === parseInt(selectedGrade);
    });

    console.log(displayedStudents);

    res.render('reports', {
        displayedStudents,
        grades
    });
    console.log("rendered");
});

app.get("/FBLA/winner", async (req, res) => {
    let schoolStudents = [];
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    for (let i = 0; i < school.students.length; i++) {
        let student = await Student.findById(school.students[i]);
        schoolStudents.push(student);
    }

    grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    let gradesStudents = [];

    // Sorts the students by grade level
    for (let i = 0; i < grades.length; i++) {
        let students = schoolStudents.filter(function (el) {
            return el.grade === grades[i];
        });
        gradesStudents.push(students);
    };

    console.log(gradesStudents);

    allWinners = [];

    // Selects the student with the highest points overall from the school
    let highestPointsStudent = null;
    let highestPoints = -Infinity;

    for (let i = 0; i < schoolStudents.length; i++) {
        if (schoolStudents[i].points > highestPoints) {
            highestPoints = schoolStudents[i].points;
            highestPointsStudent = schoolStudents[i];
        }
    };

    highestPointsStudent = JSON.parse(JSON.stringify(highestPointsStudent));
    console.log(highestPointsStudent);
    // Add the reason for winning to the student object
    highestPointsStudent["reason"] = "Overall Winner";
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

    // Using the gradesStudents array, select a student from each grade level.
    // It will be added to the allWinners array
    let currentGrade = null;
    let randomWinner = null;

    for (let i = 0; i < gradesStudents.length; i++) {
        currentGrade = gradesStudents[i];
        randomWinner = currentGrade[Math.floor(Math.random() * currentGrade.length)];
        console.log(randomWinner);
        // If the random winner is undefined, then there are no students in that grade level, so skip it
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
        randomWinner["reason"] = "Random Winner (Grade " + grades[i] + ")";
        allWinners.push(randomWinner);

    }




    // let gradeNineWinner = gradeNine[Math.floor(Math.random() * gradeNine.length)];
    // let gradeTenWinner = gradeTen[Math.floor(Math.random() * gradeTen.length)];
    // let gradeElevenWinner = gradeEleven[Math.floor(Math.random() * gradeEleven.length)];
    // let gradeTwelveWinner = gradeTwelve[Math.floor(Math.random() * gradeTwelve.length)];
    // let allWinners = [];
    // if (gradeNineWinner != undefined) {
    //     allWinners.push(gradeNineWinner);
    // }
    // if (gradeTenWinner != undefined) {
    //     allWinners.push(gradeTenWinner);
    // }
    // if (gradeElevenWinner != undefined) {
    //     allWinners.push(gradeElevenWinner);
    // }
    // if (gradeTwelveWinner != undefined) {
    //     allWinners.push(gradeTwelveWinner);
    // }
    res.render('winner', {
        allWinners
    });
    console.log("rendered");
});

app.post("/FBLA/AddEvent", (req, res) => {
    Teacher.findById(signedInUser._id, (err, data) => {
        if (err) throw err;
        School.findById(data.schoolId, (error, school) => {
            Event.create(req.body, (err, event) => {
                School.findByIdAndUpdate(school._id, { $push: { events: event._id } }, (er, schoolEvnt) => {
                    if (er) throw er;
                });
                res.redirect('/FBLA/events');
            });
        });
    });
});

app.post("/FBLA/EditEvent", async (req, res) => {
    if (req.body.selectedId == "none") {
        res.redirect('/FBLA/events');
        return;
    }
    let editedEvent = await Event.findByIdAndUpdate(req.body.selectedId, req.body);
    res.redirect('/FBLA/events');
});

app.post("/FBLA/SignUp", async (req, res) => {
    let data = req.body;
    let school = await School.findOne({ name: data.school });
    if (school != null) {
        data.schoolId = school._id;
    }
    else {
        data.schoolId = (await School.create({ name: data.school }))._id;
    }
    Teacher.findOne({ username: data.username }, (error, user) => {
        if (user) {
            res.redirect('/FBLA');
        }
        else if (data.confirmPassword === data.password) {
            console.log(data);
            Teacher.create(data, (error, args) => {
                if (error) throw error;
                console.log("Hello");
                res.redirect('/FBLA');
            });
        }
        else {
            res.redirect('/FBLA');
        }
    });
});

app.post("/FBLA/Login", async (req, res) => {
    const { username, password } = req.body;
    Teacher.findOne({ username: username }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    res.redirect('/FBLA/dashboard');
                    signedInUser = user;
                }
                else {
                    res.redirect('/FBLA');
                }
            });
        }
        else {
            res.redirect('/FBLA');
        }
    });
});

app.post("/FBLA/AddStudent", (req, res) => {
    Student.create(req.body, (err, data) => {
        res.redirect('/FBLA/dashboard');
    });
});

app.post("/FBLA/AssignPoints", async (req, res) => {
    if (req.body.name == "none") {
        res.redirect('/FBLA/dashboard');
        return;
    }
    console.log(req.body);
    let student;
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let event = await Event.findOne({ name: req.body.name });
    let existingStudent = await Student.findOne({ name: req.body.studentName, grade: req.body.grade });
    if (existingStudent != null) {
        let existingStudentID = existingStudent._id;
        console.log(existingStudent);
        let numPoints = existingStudent.points + event.points;
        console.log(numPoints);
        Student.findByIdAndUpdate(existingStudentID, { "points": numPoints }, (err, data) => {
            if (err) throw err;
            console.log("Updated?");
            res.redirect('/FBLA/dashboard');
        });
    } else {
        student = await Student.create({ name: req.body.studentName, grade: req.body.grade, points: event.points });
        School.findByIdAndUpdate(school._id, { $push: { students: student._id } }, (err, schoolEvnt) => {
            if (err) throw err;
            res.redirect('/FBLA/dashboard');
        });
    }
});