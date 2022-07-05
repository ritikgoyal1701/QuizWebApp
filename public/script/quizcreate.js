$(".select").click(function (event) {
    // console.log("click")
    var parent = $(event.target).parent();
    var data = parent[0].getElementsByTagName('p');
    const a = {
        id: parent[0].id,
        question: data[0].innerText,
        options: [
            data[1].innerText.substring(0), 
            data[2].innerText.substring(0), 
            data[3].innerText.substring(0), 
            data[4].innerText.substring(0)],
        answer: data[5].innerText.substring(15,16)
    }
    selected.push(a);
    // xx.innerHTML="HELLO";
    // console.log(xx);
    window.localStorage.setItem("selected", JSON.stringify(selected));
    update_sheet();
    // window.location.reload();
});
$(document).ready(function(){
    switchhVisible();
});

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
const create_quiz=()=>{
    if(document.getElementById("quiz").value.trim().length>0 && (created.length>0 || selected.length>0)){
        let sel=[];
        selected.forEach(element=>{
            sel.push(element.id);
        })
        data={
            selected:sel,
            Question:created,
            Name: document.getElementById("quiz").value.trim()
        }
        console.log(data);
        sendHTTPreq('POST',window.location.href,{
            Quiz:data
        }).then((message)=>{
            document.getElementById("msg").innerText=message.message;
            document.getElementById("msg").style.color="Green";
            localStorage.clear();
            // console.log(message);
            if(message.message!="Subject already exist!!"){
                setTimeout(function () {
                    let url="/profile";
                    window.location=url;
                }, 1000);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    else if(document.getElementById("quiz").value.trim().length===0){
        document.getElementById("msg").innerText="Enter Quiz Name";
        document.getElementById("msg").style.color="Red";
    }
    else{
        document.getElementById("msg").innerText="Add or select questions";
        document.getElementById("msg").style.color="Red"
    }
}

const delete_ques=(p)=>{
    console.log("P");
    if(p.id[0]==='c'){
        created.splice(p.id.substring(1)-1,1);
        window.localStorage.setItem("created",JSON.stringify(created));
    }
    else
    {
        console.log(selected.length);
        selected.splice(p.id.substring(1)-1,1);
        window.localStorage.setItem("selected",JSON.stringify(selected));
    }
    update_sheet();
    // window.location.reload();
    // console.log(p.id.substring(1)-1);
}
async function insertnew() {
    const a = {
        // id: parent[0].id,
        Question: question,
        Options: [option1, option2, option3, option4],
        Answer: answer
    }
    // console.log("a");
    created.push(a);
    
    window.localStorage.setItem("created",JSON.stringify(created));
    update_sheet();
    
    // window.location.reload();
    // document.getElementById("insert_new").innerHTML="";
    switchhVisible();
}
const prepare_question=()=>{
    const promise=new Promise(async (resolve,reject)=>{
        let new_sheet = "";
        let i=0;
        // console.log(created);
        await selected.forEach(element => {
            new_sheet+='<div class="card w-100 ques_card card-body">';
            i=i+1;
            new_sheet += "<div class='represent' >";
            new_sheet += "<i class='fa fa-trash-o icon' aria-hidden='true' onclick='delete_ques(this)' id='s"+i+"'>"+"</i>";
            new_sheet += "<span style='display:none'>" + element.id + "</span>";
            new_sheet += "<p> " + element.question + "</p>";
            new_sheet += "<p>1) " + element.options[0] + "</p>";
            new_sheet += "<p>2) " + element.options[1] + "</p>";
            new_sheet += "<p>3) " + element.options[2] + "</p>";
            new_sheet += "<p>4) " + element.options[3] + "</p>";
            new_sheet += "<p>Answer: Option-" + element.answer + "</p></div>";
            new_sheet += "</div>";
        });
        i=0;
        await created.forEach(element => {
            new_sheet+='<div class="card w-100 ques_card card-body">';
            i=i+1;
            new_sheet += "<div class='represent'>";
            new_sheet += "<i class='fa fa-trash-o icon' aria-hidden='true' onclick='delete_ques(this)' id='c"+i+"'>"+"</i>";
            // new_sheet += "<span style='display:none'>" + element.id + "</span>";
            new_sheet += "<p> " + element.Question + "</p>";
            new_sheet += "<p>1) " + element.Options[0] + "</p>";
            new_sheet += "<p>2) " + element.Options[1] + "</p>";
            new_sheet += "<p>3) " + element.Options[2] + "</p>";
            new_sheet += "<p>4) " + element.Options[3] + "</p>";
            new_sheet += "<p>Answer: Option-" + element.Answer + "</p></div>";
            new_sheet += "</div>";
        });
        resolve(new_sheet);
    })
    return promise;
}

const update_sheet = () => {
    // console.log(new_sheet);
    prepare_question().then((new_sheet)=>{
        var xx = document.getElementById('qsabcd');
        xx.innerHTML=new_sheet;
    })
}

var selected;
var created;
const a = document.getElementById("qs");
// console.log(selected);
window.onload = function () {
    let url=window.location.href.split("/");
    if(JSON.parse(window.localStorage.getItem("Subject"))===url[4] && JSON.parse(window.localStorage.getItem("Topic"))===url[5]){
        selected = JSON.parse(window.localStorage.getItem("selected"));
        created = JSON.parse(window.localStorage.getItem("created"));
        update_sheet();
    }
    else
    {
        selected=[];
        created=[]
        window.localStorage.setItem("Subject",JSON.stringify(url[4]));
        window.localStorage.setItem("Topic",JSON.stringify(url[5]));
        window.localStorage.setItem("selected",JSON.stringify(selected));
        window.localStorage.setItem("created",JSON.stringify(created));
    }
}
//Choose question from database toggler
function switchVisible(){
        if (document.getElementById('database').style.display == 'none') {
            document.getElementById("insert_new").style.display = 'none';
            document.getElementById('database').style.display = 'block';
        }
        else {
            document.getElementById("insert_new").style.display = 'none';
            document.getElementById('database').style.display = 'block';
        }
    }

// var i = 0;
function switchhVisible() {
    let question = '';
    question+='<div class="option" id="new_ques" style="border-left:0px;border-right:0px;border-top:0px;" required>Enter the Question and options below</div>';
    question+='<br>';
    question+='<input type="text" name="question" placeholder="Enter the question" id="qs" style="margin-top:10px; border-radius:10px; outline:none; padding:5px 12px" onchange="question=this.value" required>';
    question+='<br>';
    question+='<br>';
    question+='<input type="text" id="opt" name="option1" placeholder="Option 1" onchange="option1=this.value"  required>';
    question+='<input type="text" id="opt" name="option2" placeholder="Option 2" onchange="option2=this.value"  required>';
    question+='<br>';
    question+='<br>';
    question+='<input type="text" id="opt" name="option3" placeholder="Option 3" onchange="option3=this.value"  required>';
    question+='<input type="text" id="opt" name="option4" placeholder="Option 4" onchange="option4=this.value"  required>';
    question+='<br>';
    question+='<br>';
    question+='<input type="number" min="1" max="4" id="opt" name="answer" placeholder="Enter the correct option number" id="qs" onchange="answer=this.value" required></input><br>';
    question+='<button type="submit" class="btn btn-outline-light " id="btn1" onclick="insertnew()">Add the Question</button>'
    // let insert=document.getElementById('insert_new');
    // console.log(insert);
    document.getElementById("database").style.display='none';
    document.getElementById("insert_new").style.display='block';
    document.getElementById("insert_new").innerHTML = question ;
    // document.getElementById('insert_new').style.display='block';
}