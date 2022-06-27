const mongoose = require("mongoose");
const db = require("../schemas.js");  //Database API
mongoose.connect("mongodb://localhost:27017/quizportaldb");

const create_quiz = async (Quiz, topic) => {
    // console.log(Quiz)
    try {
        let Questions = Quiz.selected;
        for (Ques of Quiz.Question) {
            let Question = new db.Question(Ques);
            await Question.save();
            Questions.push(Question);
        };
        // console.log(Questions);
        let quiz = new db.Quiz({
            Name: Quiz.Name,
            Questions: Questions,
            Max_Marks: 2 * Questions.length
        });
        // console.log(quiz);
        await quiz.save();
        await db.Topic.updateOne({ "Topic": topic }, {
            $push: {
                Quizzes: {
                    _id: quiz,
                    Name: Quiz.Name
                }
            }
        });
        return quiz;   
    } catch (error) {
        console.log(error);
    }
}

const subject_get = async (req, res) => {
    // console.log(req.isAuthenticated(),req.user,req.params);
    try {
        result=await db.Subject.find({});
        res.render("Create_choose.ejs",{
            data:result,
            user:req.user,
            choose:"Subject",
            view:false
        });
    } catch (error) {
        console.log(error);
    }
}

const subject_create = async (req, res) => {
    try {
        db.Subject.find({ Subject: req.body.Subject }, async function (err, result) {
            // console.log(result);
            if (err) {
                console.log(err);
            }
            if (result.length === 0) {
                let temp = new db.Subject({
                    Subject: req.body.Subject
                })
                temp.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        res.status(201).json({
                            message:"Subject Created Successfully!!"
                        });
                    }
                })
            }
            else{
                res.status(409).json({
                    message:"Subject already exist!!"
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const topic_get = async (req, res) => {
    let data=[];
    try {
        // console.log("here");
        let result=await db.Subject.findOne({ Subject: req.params.subject });
        if(result)
        {    
            data=await Promise.all(result.Topics.map(async (element) => {
                let k=await db.Topic.findOne({_id:element._id});
                // console.log(k);
                return k;
            }));
            res.render("Create_choose.ejs",{
                data:data,
                user:req.user,
                choose:"Topic",
                view:false
            });
        }
        else{
            res.redirect("/logout");
        }
    } catch (error) {
        console.log(error);
    }
    // console.log(data);
    // res.send(data);
}

const topic_create = async (req, res) => {
    try {
        let result=await db.Topic.find({ Topic: req.body.topic });
        let temp = new db.Topic({
            Topic: req.body.topic
        })
        if (result.length === 0) {
            await temp.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            temp=temp._id;
        }
        else {
            temp = result[0]._id;
        }
        let f=await db.Subject.updateOne({ Subject: req.params.subject }, {
            $push: {
                "Topics": {
                    _id: temp,
                    Name: req.body.topic
                }
            }
        });
        // console.log(f);
        res.status(201).json({
            message:"Successfully added Topic!!!"
        });
    } catch (error) {
        console.log(error);
    }
}

async function exist(subject,topic){
    try {
        
        let sub=await db.Subject.findOne({Subject: subject});
        // console.log(sub);
        let v=0;
        if(sub)
        {
            // console.log(topic);
            sub.Topics.forEach(element => {
                // console.log(element.Name===topic);
                if(element.Name==topic){
                    v=1;
                }
                // console.log("k",v);
            });
        }
        // console.log("HEre");
        // console.log(v);
        if(v===0){
            return '1';
        }
        else{
            return '0';
        }
    } catch (error) {
        console.log(error);
    }
}

const quiz_get = async (req, res) => {
    try {
        let result=await db.Topic.findOne({ Topic: req.params.topic });
        let verify=await exist(req.params.subject,req.params.topic);
        // console.log(verify);
        if(!result || verify==='1'){
            res.redirect("/logout");
        }
        else{
            Questions = [];
            for (each of result.Quizzes) {
                let result1=await db.Quiz.findById(each._id );
                for (Ques of result1.Questions) {
                    let result2=await db.Question.findById(Ques);
                    Questions.push(result2);
                }
            }
            res.render("quizcreate.ejs",{
                data:Questions,
                user:req.user
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const quiz_create = async (req, res) => {
    try {
        let k = await create_quiz(req.body.Quiz, req.params.topic);
        let quiz_r = new db.Quiz_Relation({
            User: req.user._id,
            Quiz: k,
            Name: req.body.Quiz.Name,
            Creator: req.user.First_Name+req.user.Last_Name
        })
        await quiz_r.save(function (err) {
            if (err) {
                console.log(err);
            }
        })
        res.status(201).json({
            message:"Quiz created Successfully!!"
        });
    } catch (error) {
        console.log(error);
    }
}


const quizcontroller = {
    subject_get,
    subject_create,
    topic_get,
    topic_create,
    quiz_get,
    quiz_create
}

module.exports = quizcontroller