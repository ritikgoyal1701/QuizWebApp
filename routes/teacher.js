const express = require("express");
const router = express.Router();
const middleware=require("../controllers/middleware.js");
const quizcontroller=require("../controllers/quizcontroller.js");
const usercontroller=require("../controllers/usercontroller.js");
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
    .post(middleware.teacher,quizcontroller.quiz_create);

router.route("/view/:Quiz")
    .get(middleware.teacher,usercontroller.leaderboard_get)
    .post(middleware.teacher,usercontroller.leaderboard_display);
module.exports=router;