const mongoose = require("mongoose");
const db = require("../schemas.js");  //Database API
mongoose.connect("mongodb://localhost:27017/quizportaldb");
async function create_data(quiz) {
    // console.log(quiz);
    let k = {};
    try {
        results = await db.Attempt.find({ Quiz: quiz });
        let maxm = 0;
        let total = 0;
        let attempts = results.length;
        results.forEach(async function (each) {
            if (maxm < each.Marks_Obtained) {
                maxm = each.Marks_Obtained;
            }
            total = total + each.Marks_Obtained;
        })
        total = total / attempts;
        try {
            let result = await db.Quiz.find({ _id: quiz });
            // console.log(result);
            return {
                "Attempts": attempts,
                "Maximum_Marks_Achieve": maxm,
                "Average": total,
                "Maximum_Marks": result[0].Max_Marks
            };
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
        return k;
    }
    catch (err) {
        if (err) {
            console.log(err);
        }
    }
}

const profile = async (req, res) => {
    let data = [];
    try {
        let result = await db.Quiz_Relation.find({ User: req.user._id });
        let n = result.length;
        data = await Promise.all(result.map(async (each) => {
            let k = await create_data(each.Quiz);
            return {
                Name: each.Name,
                details: k,
            }
        }));
    }
    catch (err) {
        if (err) {
            console.log(err);
        }
    }
    res.render("profile.ejs", {
        user: req.user,
        data: data
    });
}

const subject_get = async (req, res) => {
    // console.log(req.isAuthenticated(),req.user,req.params);
    try {
        result = await db.Subject.find({});
        res.render("Create_choose.ejs", {
            data: result,
            user: req.user,
            choose: "Subject",
            view: true
        });
    } catch (error) {
        console.log(error);
    }
}

const topic_get = async (req, res) => {
    let data = [];
    try {
        // console.log("here");
        let result = await db.Subject.findOne({ Subject: req.params.subject });
        if (result) {
            data = await Promise.all(result.Topics.map(async (element) => {
                let k = await db.Topic.findOne({ _id: element._id });
                // console.log(k);
                return k;
            }));
            res.render("Create_choose.ejs", {
                data: data,
                user: req.user,
                choose: "Topic",
                view: true
            });
        }
        else {
            res.redirect("/logout");
        }
    } catch (error) {
        console.log(error);
    }
    // console.log(data);
    // res.send(data);
}

const quiz_get = async (req, res) => {
    try {
        let Subject = await db.Subject.findOne({ Subject: req.params.subject });
        if (Subject) {
            let flag = false;
            await Subject.Topics.forEach(topic => {
                // console.log(topic,req.params.topic);
                if (topic.Name === req.params.topic) {
                    flag = true;
                }
            })
            // console.log(flag);
            if (flag) {
                let Topic = await db.Topic.findOne({ Topic: req.params.topic });
                if (Topic) {
                    let data = await Promise.all(Topic.Quizzes.map(async (element) => {
                        let k = await db.Quiz.findById(element._id);
                        let r = (await db.Quiz_Relation.findOne({ Quiz: element._id }))["Creator"];
                        let at = (await db.Attempt.find({ Quiz: element._id })).length;
                        // k["Creator"]=r["Creator"];
                        // console.log(k,r["Creator"]);
                        return { k, r, at };
                    }))
                    // console.log(data[0]);
                    res.render("Create_choose.ejs", {
                        data: data,
                        choose: "Quiz",
                        user: req.user,
                        view: true
                    })
                    return;
                }
            }
        }
        res.redirect("/logout");
    } catch (error) {
        console.log(error);
    }
};

const quiz_display = async (req, res) => {
    try {
        let Subject = await db.Subject.findOne({ Subject: req.params.subject });
        if (Subject) {
            let flag = false;
            await Subject.Topics.forEach(topic => {
                // console.log(topic,req.params.topic);
                if (topic.Name === req.params.topic) {
                    flag = true;
                }
            })
            if (flag) {
                let Topic = await db.Topic.findOne({ Topic: req.params.topic });
                if (Topic) {
                    flag = false;
                    // let comp='new ObjectId("'+req.params.quiz+'")';
                    await Topic.Quizzes.forEach(quiz => {
                        // console.log(typeof(JSON.stringify(quiz._id)),quiz._id);
                        // typeof(quiz._id);
                        if (JSON.stringify(quiz._id).split('"')[1] === req.params.quiz) {
                            flag = true;
                        }
                    })
                    // console.log(flag);
                    if (flag) {
                        let Quiz=await db.Quiz.findById(req.params.quiz);
                        if(Quiz)
                        {
                            let data=await Promise.all(Quiz.Questions.map(async(ques)=>{
                                let Question=await db.Question.findById(ques);
                                return Question;
                            }))
                            res.send(data);
                            return;
                        }
                    }
                }
            }
        }
        res.redirect("/logout");
    } catch (error) {
        console.log(error);
    }
}
const usercontrollers = {
    profile,
    subject_get,
    topic_get,
    quiz_get,
    quiz_display
};

module.exports = usercontrollers;