const express = require("express");
const router = express.Router();
const middleware=require("../controllers/middleware.js");
const reg=require("../controllers/authentication.js");
const usercontrollers=require("../controllers/usercontroller.js");
const quizcontroller=require("../controllers/quizcontroller.js");
const quizusage=require("../controllers/quizusage.js");
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

//Quiz Creation - Subject
router.route("/createQuiz/")
    .get(middleware.teacher,quizcontroller.subject_get)
    .post(middleware.teacher,quizcontroller.subject_create);

//Quiz Creation - Topic
router.route("/createQuiz/:subject")
    .get(middleware.teacher,quizcontroller.topic_get)
    .post(middleware.teacher,quizcontroller.topic_create);

//Quiz Creation
router.route("/createQuiz/:subject/:topic/newQuiz")
    .get(middleware.teacher,quizcontroller.quiz_get)
    .post(middleware.teacher,quizcontroller.quiz_create)

//Show subjects
router.route("/quizAvailable/")
    .get(middleware.user,quizusage.show_subjects);

//Show Topics
router.route("/quizAvailable/:subject")
    .get(middleware.user,quizusage.show_topics);

//Show Quizzes
router.route("/quizAvailable/:subject/:topics")
    .get(middleware.user,quizusage.show_quizzes);

//Show Quiz
router.route("/quizAvailable/:subject/:topic/:Quiz")
    .get(middleware.user,quizusage.show_quiz);

module.exports=router;