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


const usercontrollers = {
    profile
};

module.exports = usercontrollers;