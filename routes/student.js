const express = require("express");
const router = express.Router();
const middleware=require("../controllers/middleware.js");
const quizhandle=require("../controllers/quizhandle.js");
// console.log("");
router.route("/test/:quiz")
    .get(middleware.user,quizhandle.quiz_format)
    .post(middleware.user,quizhandle.quiz_display);

router.route("/test/:quiz/submit")
    .post(middleware.student,quizhandle.result_calculate)
    .get(middleware.student,quizhandle.result_display);

router.route("/test/:quiz/:scored/:outof/")
    .get(middleware.student,quizhandle.result_display);

router.route("/attempt/:quiz")
    .get(middleware.student,quizhandle.quiz_format_attempt)
    .post(middleware.student,quizhandle.quiz_display);
module.exports=router