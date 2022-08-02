let table;
const create=async(Name,Score,Time,Rank)=>{
  var row=table.insertRow(Rank);
  var cell1=row.insertCell(0);
  var cell2=row.insertCell(1);
  var cell3=row.insertCell(2);
  var cell4=row.insertCell(3);
  cell1.innerHTML = Rank;
  cell2.innerHTML = Name;
  cell3.innerHTML = Score;
  cell4.innerHTML= Time;
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

const load_leaderboard=async()=>{
  sendHTTPreq("POST",window.location.href)
    .then(async(data)=>{
      // console.log(data);  
      table=document.getElementById("ScoreBoard");
      let i=1;
      if(data.length===0){
        document.getElementById("Not_created").innerText="No one attempted the quiz!";
      }
      else
      {
      await data.forEach(element => {
        create(element.Name,element.Score,element.Time,i);
        i=i+1;
      });
    }
    }).catch(error=>{
      console.log(error);
      res.redirect("/login");
    })
}