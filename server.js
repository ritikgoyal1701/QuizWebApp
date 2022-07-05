//jshint esversion:6
const express = require("express");
const body_parser = require("body-parser");
const ejs = require("ejs");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
const cors=require("cors");
const session = require("express-session");
const passport = require("passport");
app.set("view-engine", "ejs");
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json())
app.use(express.static("public"));
app.use(session({
    secret: "Secret must remain secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
const db = require(__dirname + "/schemas.js");  //Database API
const User = db.User;

//Database Connection
passport.use(User.createStrategy());
passport.serializeUser(async function (User, done) {
    done(null, User.id);
});
passport.deserializeUser(async function (id, done) {
    User.findById(id, async function (err, User) {
        done(err, User);
    });
});
//Home Page
app.get("/", async function (req, res) {
    res.redirect("/login");
})

app.use(cors());
//Fetching of routes
let teacherroutes=require('./routes/teacher');
app.use('/',teacherroutes);

let userroutes=require('./routes/user');
app.use('/',userroutes);

let studentroutes=require('./routes/student');
app.use('/',studentroutes);

app.listen("3121", async function () {
    console.log("Server is started at port 3121");
})