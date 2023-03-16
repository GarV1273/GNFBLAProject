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
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.w6jnzm3.mongodb.net/userData`, {useNewUrlParser:true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
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

app.get("/FBLA/editEvent", (req, res) => {
    res.render('editEvent');
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
    res.render('assignPoints', {
        schoolEvents
    });
    console.log("rendered");
});

app.get("/FBLA/reports", (req, res) => {
    res.render('reports');
    console.log("rendered");
});

app.get("/FBLA/winner", (req, res) => {
    res.render('winner');
    console.log("rendered");
});

app.post("/FBLA/AddEvent", (req, res) => {
    Teacher.findById(signedInUser._id, (err, data) => {
        if (err) throw err;
        School.findById(data.schoolId, (error, school) => {
            Event.create(req.body, (err, event) => {
                School.findByIdAndUpdate(school._id,{$push : {events : event._id}}, (er, schoolEvnt) => {
                    if (er) throw er;
                });
                res.redirect('/FBLA/events');
            });
        });
    });
});

app.post("/FBLA/EditEvent", (req, res) => {
    Event.findOneAndUpdate({name: req.body.name},req.body);
});

app.post("/FBLA/SignUp", async (req, res) => {
    let data = req.body;
    let school = await School.findOne({name:data.school});
    if (school != null) {
        data.schoolId = school._id;
    }
    else {
        School.create({name: data.school}, (err, args) => {
            data.schoolId = args._id;
        });
    }
    Teacher.findOne({username:data.username}, (error, user) => {
        if (user) {
            res.redirect('/FBLA');
        }
        else if (data.confirmPassword === data.password) {
            Teacher.create(data, (error, args) => {
                res.redirect('/FBLA');
            });
        }
        else {
            res.redirect('/FBLA');
        }
    });
});

app.post("/FBLA/Login", async (req, res) => {
    const {username, password} = req.body;
    Teacher.findOne({username:username}, (error, user) => {
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
    console.log(req.body);
    let student;
    let teacher = await Teacher.findById(signedInUser._id);
    let school = await School.findById(teacher.schoolId);
    let event = await Event.findOne({name: req.body.name});
    let existingStudent = await Student.findOne({name: req.body.studentName, grade: req.body.grade});
    if (existingStudent != null) {
        console.log("Hello");
        let numPoints = existingStudent.points + event.points;
        Student.findOneAndUpdate(existingStudent, {points: numPoints},(err, data) => {
            if (err) throw err;
            School.findByIdAndUpdate(school._id,{$push : {students : data._id}}, (err, schoolEvnt) => {
                if (err) throw err;
                res.redirect('/FBLA/dashboard');
            });
        });
    } else {
        student = await Student.create({name: req.body.studentName, grade: req.body.grade, points: event.points});
        School.findByIdAndUpdate(school._id,{$push : {students : student._id}}, (err, schoolEvnt) => {
            if (err) throw err;
            res.redirect('/FBLA/dashboard');
        });
    }
});