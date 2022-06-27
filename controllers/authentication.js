const ejs = require("ejs");
const db = require("../schemas.js");  //Database API
const User = db.User;
const passport = require("passport");
const register_get=async (req, res)=> {
    res.render("register.ejs");
}

const register_post=async (req, res) => {
    let teacher=false;
    if(req.body.teacher==='on'){
        teacher=true;
    }
    // console.log(req.body)
    User.register({
        username: req.body.E_mail,
        First_Name: req.body.first_name,
        Last_Name: req.body.last_name,
        Phone_No: req.body.phone_no,
        Is_Teacher: teacher
    },
        req.body.password,
        async function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).json({ message: err });
                // res.redirect("/register");
            }
            else {
                res.redirect("/login");
            }
        });
}

const login_get=async (req, res)=> {
    res.render("login.ejs");
}

const login_post=async function (req, res) {
    // console.log(req.body);
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    // console.log(user);
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/profile");
            });
        }
    });

}

const logout=async (req,res)=>{
    req.logout();
    res.redirect("/");
}

const register={
    register_get,
    register_post,
    login_get,
    login_post,
    logout
}

module.exports=register;