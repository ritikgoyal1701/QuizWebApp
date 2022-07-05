const mongoose = require("mongoose");
const db = require("../schemas.js");  //Database API
mongoose.connect("mongodb://localhost:27017/quizportaldb");
async function create_data(quiz) {
    try {
        let results = await db.Attempt.find({ Quiz: quiz });
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
        let result = await db.Quiz.find({ _id: quiz });
        return {
            "Attempts": attempts,
            "Maximum_Marks_Achieve": maxm,
            "Average": total,
            "Maximum_Marks": result[0].Max_Marks
        };
    }
    catch (err) {
        console.log(err);
    }
}

const profile = async (req, res) => {
    let data = [];
    try {
        if(req.user.Is_Teacher){
            let result = await db.Quiz_Relation.find({ User: req.user._id });
            data = await Promise.all(result.map(async (each) => {
                let k = await create_data(each.Quiz);
                return {
                    Id: each.Quiz,
                    Name: each.Name,
                    details: k,
                }
            }));
        }
        else
        {
            let result=await db.Attempt.find({User:req.user._id});
            data=await Promise.all(result.map(async(each)=>{
                let k=await create_data(each.Quiz);
                let n=(await db.Quiz.findById(each.Quiz))["Name"];
                // console.log(n);
                return {
                    Id:each.Quiz,
                    Name: n,
                    details: k,
                    Marks_Obtained: each.Marks_Obtained,
                    Time: each.Time 
                }
            }))
        }
    }
    catch (err) {
            console.log(err);
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
                    let attempted=await db.Attempt.find({User:req.user._id});
                    let Quizzes=await Topic.Quizzes.filter(function(val) {
                        flag=false;
                        attempted.forEach(ele=>{
                            // console.log(ele.Quiz,val._id);
                            if(ele.Quiz.toString()===val._id.toString()){
                                flag=true;
                            }
                        })
                        if(flag){
                            return false;
                        }
                        else{
                            return true;
                        }
                      });
                    //   console.log(Quizzes);
                    let data = await Promise.all(Quizzes.map(async (element) => {
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

const leaderboard_get=async(req,res)=>{
    try {
        let chk=await db.Quiz_Relation.findOne({Quiz:req.params.Quiz,User:req.user._id});
        if(chk){
            res.render("leaderboard.ejs",{
                user:req.user
            });
        }
        else{
            res.redirect("/logout");
        }
    } catch (error) {
        console.log(error);
    }
}

const leaderboard_display=async(req,res)=>{
    try {
        // console.log("init");
        let attempt=await db.Attempt.find({Quiz: req.params.Quiz});
        // console.log(attempt);
        let data=await Promise.all(attempt.map(async(ele)=>{
            let n;
            try {
                n=await db.User.findById(ele.User);
                // console.log(n);
            } catch (error) {
                console.log(error);
            }
            return {
                Name:n["First_Name"]+" "+n["Last_Name"],
                Time:ele.Time,
                Score:ele.Marks_Obtained
            }
        }));
        // console.log("sfwefwef",data);
        data.sort((a,b)=>{
            if(a["Score"]===b["Score"])
            {
                return a["Time"]-b["Time"];
            }
            else
            {
                return b["Score"]-a["Score"];
            }
        });
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
    }
}

const usercontrollers = {
    profile,
    subject_get,
    topic_get,
    quiz_get,
    leaderboard_get,
    leaderboard_display
};

module.exports = usercontrollers;