function quiz() {
    document.getElementsByClassName("add_new")[0].style.display = 'block';
}
// const axios=require("asxios");
const choose_subject=(e)=>{
    let subject=e.getElementsByClassName("subject")[0].innerHTML;
    let url=window.location.href+subject+"/";
    window.location=url;
}

const choose_topic=(e)=>{
    let subject=e.getElementsByClassName("subject")[0].innerHTML;
    let url=window.location.href+subject+"/newQuiz/";
    window.location=url;
}
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
const add_subject=()=>{
    let k=document.getElementById('input_text').value.trim();
    if(k.length>0){
        sendHTTPreq('POST',window.location.href,{
            Subject:k
        }).then((message)=>{
            document.getElementById("msg").innerText=message.message;
            // console.log(message);
            if(message.message!="Subject already exist!!"){
                setTimeout(function () {
                    let url=window.location.href+k+"/";
                    window.location=url;
                }, 5000);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
}

const add_topic=()=>{
    let k=document.getElementById('input_text').value.trim();
    if(k.length>0){
        sendHTTPreq('POST',window.location.href,{
            topic:k
        }).then((message)=>{
            document.getElementById("msg").innerText=message.message;
            // console.log(message);
            if(message.message!="Topic already exist!!"){
                setTimeout(function () {
                    let url=window.location.href+k+"/newQuiz/";
                    window.location=url;
                }, 5000);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
}
