const mongoose = require("mongoose");
const db = require("../schemas.js");  //Database API
// mongoose.connect(`${process.env.mongo}/quizportaldb`);

const quiz_format=async (req,res)=>{
    try {
        let name=(await db.Quiz.findById(req.params.quiz))["Name"];
        if(!req.user.Is_Teacher)
        {
            res.render("quiz.ejs",{
                user:req.user,
                attempt:true,
                name:name
            });
        }
        else
        {
            res.render("quiz.ejs",{
                user:req.user,
                attempt:false,
                name:name
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect("/login");
    }
}

const quiz_format_attempt=async (req,res)=>{
    try {
        // console.log(req.params.quiz);
        let name=(await db.Quiz.findById(req.params.quiz))["Name"];
        res.render("quiz.ejs",{
            user:req.user,
            attempt:false,
            name:name
        });
    } catch (error) {
        console.log(error);
        res.redirect("/login");
    }
}

const quiz_display = async (req, res) => {
    try {
        let Quiz=await db.Quiz.findById(req.params.quiz);
        if(Quiz)
        {
            let data=await Promise.all(Quiz.Questions.map(async(ques)=>{
                let Question=await db.Question.findById(ques);
                return Question;
            }))
            if(req.body.attempt){
                res.status(201).json({
                    data:data
                });
            }
            else{
                let Answer=await Promise.all(Quiz.Questions.map(async(ques)=>{
                    let ans=(await db.Answer.findOne({Question:ques}))["Answer"];
                    return ans;
                }))
                if(req.user.Is_Teacher){
                    res.status(201).json({
                        data:data,
                        Answer:Answer
                    });
                }
                else{
                    let attempt=await db.Attempt.findOne({Quiz:req.params.quiz,User:req.user._id});
                    let k=await Promise.all(attempt.Attempts.map(async(ele)=>{
                        return ele["Answer"]
                    }));
                    res.status(201).json({
                        data:data,
                        Answer:Answer,
                        Attempt:k
                    });
                }
            }
            return;
        }
        res.redirect("/logout");
    } catch (error) {
        console.log(error);
        res.redirect("/login");
    }
}

const result_calculate=async(req,res)=>{
    try
    {
        // console.log(req.body);
        let ques=req.body.json;
        let Score=0;
        let p=await Promise.all(ques.map(async(attempt) => {
            let temp=await db.Answer.findOne({"Question":attempt.Question});
            // console.log(temp);
            if(temp && temp["Answer"]===attempt.Answer){
                Score+=2;
            }
            return attempt;
        }));
        // console.log(Score);
        let Attempt=new db.Attempt({
            Quiz:req.params.quiz,
            User:req.user._id,
            Marks_Obtained:Score,
            Time:req.body.time,
            Attempts:ques
        })
        // console.log(Attempt);
        await Attempt.save();
        res.status(201).json({Score:Score});
    }
    catch(error){
        console.log(error);
        res.redirect("/login");
    }
}

const result_display=async(req,res)=>{
    res.render("result.ejs",{
        Scored:req.params.scored,
        Outof:req.params.outof
    });
}
let quizhandle={
    quiz_display,
    quiz_format,
    result_calculate,
    result_display,
    quiz_format_attempt
}
module.exports = quizhandle;