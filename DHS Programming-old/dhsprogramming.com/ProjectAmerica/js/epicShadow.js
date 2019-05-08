var library = {
	shadow: "document.getElementById('shadow1')",
}
var shadow = document.getElementById("shadow1");
var frame = 1;
var foward = true;
var going = false;

function animate(){
	if(going){
		if(foward){
			frame++;
			shadow.setAttribute("id", "shadow"+frame);
		
			if(frame >= 5){
				foward = false;
			}
		}
		else{
			frame--;
			shadow.setAttribute("id", "shadow"+frame);
			if(frame <= 1){
				foward = true;
			}
		}
	}
}

shadow.onmouseover = function(){
	going = true;
}
shadow.onmouseout = function(){
	going = false;
}

setInterval("animate()", 200);