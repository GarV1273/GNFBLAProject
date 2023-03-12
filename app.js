const express = require('express');
const fs = require('fs');
const path = require('path');
const app = new express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User.js');

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

app.get("/FBLA/dashboard", (req, res) => {
    res.render('dashboard');
    console.log("rendered");
});

app.get("/FBLA/events", (req, res) => {
    res.render('events');
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