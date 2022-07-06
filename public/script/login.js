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

const login=async()=>{
    let k={
        username:document.getElementById("username").value,
        password:document.getElementById("password").value
    }
    sendHTTPreq("POST",window.location.href,k)
        .then((message)=>{

        })
        .catch((error)=>{
            
        })
}