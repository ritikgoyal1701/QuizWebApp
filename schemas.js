//jshint esversion:6
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const user_schema=new mongoose.Schema({
    // username:String,
    // password:String
    username:{
        type: String,
        trim: true,
        lowercase: true
    },
    First_Name:{
        type: String,
        trim: true
    },
    Last_Name:{
        type: String,
        trim: true
    },
    password:{
        type: String,
        trim: true,
    },
    Phone_No:{
        type: Number,
        trim: true
    },
    Is_Teacher:{
        type: mongoose.Schema.Types.Boolean
    }
})
user_schema.plugin(passportLocalMongoose);
const User=mongoose.model("User",user_schema);

const question_schema=new mongoose.Schema({ 
    Question:{
        type: String,
        trim: true
    },
    Options:{
        type: [String]
    },
    Answer:{
        type: Number,
        trim: true
    }
});
const Question=mongoose.model("Question",question_schema);

const quiz_schema=new mongoose.Schema({
    Name:{
        unique: true,
        type: String,
        trim: true
    },
    Questions:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: Question
    },
    Max_Marks:{
        type: Number
    }
});
const Quiz=mongoose.model("Quiz",quiz_schema);

const topic_schema=new mongoose.Schema({
    Topic:{
        type:String,
        trim: true
    },
    Quizzes:[{
        _id:{type: mongoose.Schema.Types.ObjectId,
        ref: Quiz},
        Name: String
    }]
});
const Topic=mongoose.model("Topic",topic_schema);

const subject_schema=new mongoose.Schema({
    Subject:{
        type: String,
        trim: true,
        unique:true
    },
    Topics:[{
        _id:{type: mongoose.Schema.Types.ObjectId,
        ref: Topic},
        Name: String
    }]
})
const Subject=mongoose.model("Subject",subject_schema);

const quiz_relation_schema=new mongoose.Schema({
    Quiz:{
        type:mongoose.Schema.Types.ObjectId,
        ref: Quiz
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref: User
    },
    Name: String,
    Creator: String
})
const Quiz_Relation=mongoose.model("Quiz_Relation",quiz_relation_schema);

const Attempt_Schema=new mongoose.Schema({
    Quiz:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Quiz
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    Marks_Obtained:{
        type:Number
    },
    Attempts:[{
        type:Number
    }]
})
const Attempt=mongoose.model("Attempt",Attempt_Schema);

exports.User=User;
exports.Question=Question;
exports.Topic=Topic;
exports.Subject=Subject;
exports.Quiz_Relation=Quiz_Relation;
exports.Attempt=Attempt;
exports.Quiz=Quiz;