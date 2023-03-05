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

app.listen(process.env.PORT || 3000);

app.get("/GNFBLA", (req, res) => {
    res.render('index');
});