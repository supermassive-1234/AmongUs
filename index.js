let x = document.getElementById("division1");
const messageField = document.querySelector("#lost");

let c = document.getElementById("btn1");
c.addEventListener('click',function(){
  if(messageField.getAttribute('value')==null){
  const message = messageField.value;
  let y=document.createElement('p');
  y.textContent=message;
  y.classList.add('myclass1');
  console.log(y.getAttribute('value'));
  x.appendChild(y);
   
  }else{
    console.log('error shown at')
   alert('value not injected successfully');
  }
});




//laugh
