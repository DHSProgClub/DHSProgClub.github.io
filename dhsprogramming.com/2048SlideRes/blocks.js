$(document).ready(function () {
    setBlock("#n2");
    setBlock("#n4");
    setBlock("#n8");
    setBlock("#n16");
    setBlock("#n32");
    setBlock("#n64");
    setBlock("#n128");
    setBlock("#n256");
    setBlock("#n512");
    setBlock("#n1024");
    setBlock("#n2048");
});

function setBlock(tile) {
    var x = genX();
    var y = genY();
    //var slideLength = 300;
	
    $(tile).css({
        "left": x,
        "top": y       
     });
}

/*function moveBlock(tile){
	$(tile).animate({
        left: slideLength,
        opacity: '0'
    }, 10000, "linear");
}*/

function genX() {
    return Math.floor(Math.random() * (screen.availWidth)-200);
}

function genY() {
    return Math.floor(Math.random() * (screen.availHeight)-200);
}