const express = require("express");
const router = express.Router();
const middleware=require("../controllers/middleware.js");
const reg=require("../controllers/authentication.js");
const usercontrollers=require("../controllers/usercontroller.js");
// const quizcontroller=require("../controllers/quizcontroller.js");

//Registration of user
router.route("/register")
    .get(reg.register_get)
    .post(reg.register_post);

//Login of user
router.route("/login")
    .get(reg.login_get)
    .post(reg.login_post);

//Logout the user
router.route("/logout")
    .get(reg.logout);

//Display profile page
router.route("/profile")
    .get(middleware.user,usercontrollers.profile);

//Choose Subject
router.route("/quiz/")
    .get(middleware.user,usercontrollers.subject_get);

//Choose Topic
router.route("/quiz/:subject/")
    .get(middleware.user,usercontrollers.topic_get);

//Choose Quiz
router.route("/quiz/:subject/:topic/")
    .get(middleware.user,usercontrollers.quiz_get);

//Display Quiz
router.route("/quiz/:subject/:topic/:quiz")
    .get(middleware.user,usercontrollers.quiz_display);
module.exports=router