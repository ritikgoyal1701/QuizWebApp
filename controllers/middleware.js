const teacher=async(req,res,next)=>{
    if (req.isAuthenticated() && req.user.Is_Teacher)
    {
        return next();
    }
    else
    {
        res.redirect("/login");
    }
}

const user=async(req,res,next)=>{
    if (req.isAuthenticated())
    {
        return next();
    }
    else
    {
        res.redirect("/login");
    }
}

const student=async(req,res,next)=>{
    if (req.isAuthenticated() && !(req.user.Is_Teacher))
    {
        return next();
    }
    else
    {
        res.redirect("/login");
    }
}


const middleware={
    teacher,
    user,
    student
}

module.exports=middleware;