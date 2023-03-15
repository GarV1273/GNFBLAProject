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

const username = encodeURIComponent('fbla');
const password = encodeURIComponent('Xtxg5EnaFVHoQ9Xs');
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.w6jnzm3.mongodb.net/userData`, {useNewUrlParser:true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({
    secret: "fblaProject",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log("listening on port 3000");
});

app.get("/FBLA", (req, res) => {
    res.render('index');
    console.log("rendered");
});

app.get("/FBLA/dashboard", (req, res) => {
    res.render('dashboard');
    console.log("rendered");
});

app.get("/FBLA/events", (req, res) => {
    res.render('events');
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

app.get("/FBLA/assign-points", (req, res) => {
    res.render('assignPoints');
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
    Event.create(req.body, (err, data) => {
        res.redirect('/FBLA/events');
    });
});

app.post("/FBLA/EditEvent", (req, res) => {
    Event.findOneAndUpdate({name: req.body.name},req.body);
});

app.post("/FBLA/SignUp", async (req, res) => {
    let data = req.body;
    let school = await School.findOne({name:data.school});
    data.schoolId = school._id;
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
                    res.redirect('/FBLA')
                    req.session.username = username;
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