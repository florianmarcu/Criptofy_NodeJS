var nr_chr;// globalx`
window.onload=function(){
	if (nr_chr=localStorage.getItem("nr"))
		nr_chr=parseInt(nr_chr);
	else
		nr_chr=0;
	setValue();
	
	window.onkeypress=function(e){
		//preiau tasta apasata:
        //char=String.fromCharCode(e.charCode?e.charCode:e.keyCode);
		nr_chr++;
		localStorage.setItem("nr", nr_chr);
		setValue();
	}

}

function setValue(){
    console.log(nr_chr);
	var info=document.getElementById("info");
	info.innerHTML=nr_chr;
}







