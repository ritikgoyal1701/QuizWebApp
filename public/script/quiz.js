const sendHTTPreq=(method,url,data)=>{
    const promise=new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest();
        xhr.open(method,url);
        xhr.responseType='json';
        if(data){
            xhr.setRequestHeader('Content-Type','application/json');
        }
        xhr.onload=()=>{
                resolve(xhr.response);
        };
        xhr.onerror=()=>{
            reject("Something Went Wrong!");
        };
           xhr.send(JSON.stringify(data));
    })
    return promise;
}
let data,question,option1,option2,option3,option4,ques_no=0,total_ques,navigator,pallete,Not_Visited,Not_Answered,Answered,Mark_For_Review,nv,na,a,mfr,navigator_ques,Mark,Options,each_ques,time,update,attempt_driven,correct_ans,attempt_ans,correct_ans_arr,attempt_ans_arr,teacher;

// 0 means not visited
// 1 means not Answered
// 2 means mark for review
// 3 means answered
const update_data=async()=>{
    window.localStorage.setItem("Quiz",JSON.stringify(window.location.href.split("/")[4]));
    window.localStorage.setItem("Not_Visited",JSON.stringify(Not_Visited));
    window.localStorage.setItem("Mark_For_Review",JSON.stringify(Mark_For_Review));
    window.localStorage.setItem("Answered",JSON.stringify(Answered));
    window.localStorage.setItem("Not_Answered",JSON.stringify(Not_Answered));
    window.localStorage.setItem("Each",JSON.stringify(each_ques));
    window.localStorage.setItem("Mark",JSON.stringify(Mark));
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

const update_question=async ()=>{
    // console.log(question);
    // console.log(Not_Visited,Not_Answered,Mark_For_Review,Answered);
    if(attempt_driven){
        if(each_ques[ques_no]===0){
            Not_Visited-=1;
            Not_Answered+=1;
            each_ques[ques_no]=1;
            navigator_ques[ques_no].style.background="Red";
        }
        await update_data();    
        nv.innerText=Not_Visited;
        na.innerText=Not_Answered;
        a.innerText=Answered;
        mfr.innerText=Mark_For_Review;
    }
    // console.log(Mark[ques_no]);
    if(Mark[ques_no]===-1){
        for(let i=0; i<4; i++)
        {
            Options[i].checked=false;
        }
    }
    else
    {
        Options[Mark[ques_no]].checked=true;
    }
    question.innerText="Q" + (ques_no+1) +" "+data[ques_no].Question;
    option1.innerText=data[ques_no].Options[0];
    option2.innerText=data[ques_no].Options[1];
    option3.innerText=data[ques_no].Options[2];
    option4.innerText=data[ques_no].Options[3];
    if(!attempt_driven){
        correct_ans.innerText="Correct Option: "+correct_ans_arr[ques_no];
        if(!teacher){
            attempt_ans.innerText="Attempted Option: "+attempt_ans_arr[ques_no];
        }
    }
    // console.log(nv,na,a,mfr);
}

const create_navigator=async ()=>{
    let s="";
    for(let i=1; i<=total_ques; i=i+1){
        s+='<div class="Question_No">'+i+'</div>';
        Mark.push(-1);
        each_ques.push(0);
    }
    document.getElementById("pallete-box").innerHTML=s;
}

const Next=async ()=>{
    // console.log(ques_no,total_ques);
    if(ques_no+1<total_ques){
        ques_no=ques_no+1;
    }
    update_question();
    return;
}

const update_frequency=async ()=>{
    // console.log(each_ques[ques_no]);
    if(each_ques[ques_no]===2){
        Mark_For_Review-=1;
    }
    if(each_ques[ques_no]===3){
        Answered-=1;
    }
    if(each_ques[ques_no]===1){
        Not_Answered-=1;
    }
}

const check=async ()=>{
    for(let i=0; i<4; i++)
    {
        if(Options[i].checked){
            Mark[ques_no]=i+1;
        }
    }
}

const clear_response=async ()=>{
    Mark[ques_no]=-1;
    await update_frequency();
    if(each_ques!=1){
        Not_Answered+=1;
        each_ques=1;
    }
    navigator_ques[ques_no].style.background="Red";
    update_question();
}

const Submit=async()=>{
    document.getElementById("Submit_quiz").onclick=null;
    window.clearInterval(update);
    let json=[];
    for(let i=0; i<total_ques; i+=1){
        json.push({
            Question:data[i]._id,
            Answer:Mark[i]
        })
    }
    time=total_ques*60-time;
    localStorage.clear();
    await sendHTTPreq("POST",window.location.href+"submit/",{
        json,time
    }).then(message=>{
        let temp=total_ques*2;
        // console.log(message);
        window.location.href=window.location.href+message.Score+"/"+temp+"/";
    }).catch(error=>{
        console.log(error);
        res.redirect("/login");
    })
}

const next=async()=>{
    await check();
    await update_frequency();
    if(Mark[ques_no]!=-1)
    {
        // console.log(Answered,Not_Answered);
        Answered+=1;
        each_ques[ques_no]=3;
        navigator_ques[ques_no].style.background="Green";
    }
    else
    {
        if(each_ques[ques_no]===1){
            Not_Answered+=1;
            // navigator_ques[ques_no].style.background="Red";
        } 
        else 
        {
            if(each_ques[ques_no]===2){
                Mark_For_Review+=1;
                // navigator_ques[ques_no].style.background="Yellow";
            } 
        }
    }
    Next();
}

const previous=async ()=>{
    if(ques_no-1>=0){
        ques_no=ques_no-1;
        update_question();
    }
}

const review=async()=>{
    await check();
    if(each_ques[ques_no]!=2){
        await update_frequency();
        each_ques[ques_no]=2;
        Mark_For_Review+=1;
    }
    navigator_ques[ques_no].style.background="Yellow";
    Next();
}
    
const timer=async()=>{
//  = total_ques;
//     if()
    // let time = startingm * 60;
    // console.log("Worling");
    const countdown = document.getElementById('min');
    update = setInterval(updateCount, 1000);
    function updateCount() {
        minutes = Math.floor(time / 60);
        seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        window.localStorage.setItem("Time",JSON.stringify(time));
        // window.localStorage.setItem("Time_s",JSON.stringify(seconds));
        countdown.innerHTML = `${minutes}:${seconds}`;
        time--;
        if (time < 0) {
            // alert("times up");
            Submit();
        }
    }
}

const post_req=(attempt,teach)=>{
    sendHTTPreq("POST",window.location.href,{
        attempt:attempt
    }).then(async (ques)=>{
        data=ques.data;
        attempt_driven=attempt;
        teacher=teach;
        question=document.getElementById("question");
        option1=document.getElementById("Option1");
        option2=document.getElementById("Option2");
        option3=document.getElementById("Option3");
        option4=document.getElementById("Option4");
        total_ques=data.length;
        navigator=document.getElementsByClassName("Question_No");
        pallete=document.getElementById("pallete-box");
        nv=document.getElementById("not_visited");
        na=document.getElementById("not_answered");
        a=document.getElementById("answered");
        mfr=document.getElementById("mark_for_review");
        Not_Answered=0;
        Not_Visited=total_ques;
        time=total_ques*60;
        // console.log(data,Not_Visited);
        Mark=[];
        each_ques=[];
        Options=document.getElementsByClassName("input_option");
        create_navigator();
        Mark_For_Review=0;
        Answered=0;
        navigator_ques=document.getElementsByClassName("Question_No");
        pallete.addEventListener("click",(e)=>{
            if(($(e.target).parent()[0]).id==="pallete-box"){
                ques_no=e.target.innerText-1;
                update_question();
            }
        })
        if(JSON.parse(window.localStorage.getItem("Quiz"))===window.location.href.split("/")[4])
        {
            Not_Visited=await JSON.parse(window.localStorage.getItem("Not_Visited"));
            Mark_For_Review=await JSON.parse(window.localStorage.getItem("Mark_For_Review"));
            Answered=await JSON.parse(window.localStorage.getItem("Answered"));
            Not_Answered=await JSON.parse(window.localStorage.getItem("Not_Answered"));
            each_ques=await JSON.parse(window.localStorage.getItem("Each"));
            Mark=await JSON.parse(window.localStorage.getItem("Mark"));
            time=await JSON.parse(window.localStorage.getItem("Time"));
            for(let i=0; i<total_ques; i++)
            {
                if(each_ques[i]===1){
                    navigator_ques[i].style.background="Red";
                }
                else
                {
                    if(each_ques[i]===2){
                        navigator_ques[i].style.background="Yellow";
                    }
                    else{
                        if(each_ques[i]===3){
                            navigator_ques[i].style.background="Green";
                        }
                    }
                }                
            }
        }
        else
        {
            localStorage.clear();
        }
        // console.log(attempt_driven);
        if(attempt){
            // console.log("k");
            timer();
        }
        else{
            correct_ans_arr=ques.Answer;
            correct_ans=document.getElementById("Correct_Answer");
            if(!teach){
                attempt_ans=document.getElementById("Attempted_Answer");
                attempt_ans_arr=ques.Attempt;
            }
        }
        await update_question();
    }).catch((err)=>{
        console.log(err);
        res.redirect("/login");
    })
}