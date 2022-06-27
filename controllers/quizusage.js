const mongoose = require("mongoose");
const db = require("../schemas.js");  //Database API
mongoose.connect("mongodb://localhost:27017/quizportaldb");

const show_subjects=async (req, res)=> {
        try {
            db.Subject.find({}, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(result);
                }
            });
        } catch (error) {
            console.log(error);
        }
}

const show_topics=async (req,res)=>{
        try {
            db.Subject.find({ Subject: req.params.subject }, async function (err, topics) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(topics);
                }
            });
        } catch (error) {
            console.log(error);
        }
}

const show_quizzes=async(req,res)=>{
        try {
            db.Topic.find({ Topic: req.params.topics }, async function (err, quizes) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(quizes);
                }
            });
        } catch (error) {
            console.log(error);
        }
}

const show_quiz=async(req,res)=>{
        try {
            db.Quiz.findOne({ Name: req.params.Quiz }, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    Questions = [];
                    for (ques_id of result.Questions) {
                        try {
                            db.Question.findById(ques_id, async function (err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    Questions.push(result);
                                }
                            })
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    res.send(Questions);
                }
            })
        } catch (error) {
            console.log(error);
        }
}

const quizusage={
    show_subjects,
    show_topics,
    show_quizzes,
    show_quiz
}

module.exports=quizusage;