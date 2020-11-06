var myVar = setInterval(setColor, 500);
grey = false;



// function setColor() {
//   var x = document.getElementById("coin-name");
//   if(!grey)
//     x.style.backgroundColor = 'grey';
//   else
//     x.style.backgroundColor = 'white';

//   grey = !grey;
// }

// var button =document.getElementsByTagName('button');
// button.onclick = function(){
//   stopColor();

// }

function stopColor() {
  clearInterval(myVar);
}

setTimeout(function(){ 
    alert('Cryptocurrencies are the new gold');
 }, 500);