//temporary implementation for testing. 
//returns array of form: [q1, correct, wrong, wrong, wrong, q2, correct, wrong,]
/*function getQuestion(){
    qSet++;
    //everything after this is temporary
    count1+=2;
    count2+=2;
    return ["q"+count1,"c"+count1,"w"+count1,"w"+count1,"w"+count1,"q"+count2,"c"+count2,"w"+count2,"w"+count2,"w"+count2]; //Remember to keep the qSet increments but not this
    

}
*/


function setBlock(tile) {
    var x = genX();
    var y = genY();
    /*var XArr = getXPositions();
    var YArr = getYPositions();
    while(checkOverlap(x,y)){
        x=genX();
        y=genY();
    }*/
    
    $(tile).css({
        "left": x,
        "top": y       
     });
    
    
    $(tile).css({
        "animation-delay": Math.random()*4 + "s" 
    });
     
    $(tile).show(); //In case any were hidden because they contained nothing
}

function genX() {
    var x = Math.floor(Math.random() * (window.innerWidth-marginX))+2;
    return x;
}

function genY() {
    var y = Math.floor(Math.random() * (window.innerHeight-marginY*2.5))+marginY;
    return y;
}

//checks overlap given point and arrays of previous x and y positions
/*function checkOverlap(xCoor, yCoor){
    xArr = getXPositions();
    yArr = getYPositions();
    for(var i=0;i<xArr.length;i++){
        if(willOverlap(xCoor,xArr[i], yCoor,yArr[i])){
            return true;
        }
    }
    
    return false;

}

//calculates distance between two top left corners, compares that with diagonal
function willOverlap(x1,x2,y1,y2){
    var d = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    return (d<getAnswerSize());
}

//calculates diagonal of answer bubble. also multiplies by 1.25. because reasons. this number may end up having to change.
function getAnswerSize(){
      var w=$("#a1").width();
      var h=$("#a1").height();
      var dist = Math.sqrt((h*h) + (w*w));
      return dist*1.25;

}

//returns array with numeric values of x positions of all answer bubbles 
function getXPositions(){
    var XPos =[];
    XPos.push($("#a1").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#a2").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#a3").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#a4").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b1").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b2").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b3").css("left").replace(/[^-\d\.]/g, ''));
    XPos.push($("#b4").css("left").replace(/[^-\d\.]/g, ''));
    return XPos;

}

//same but y
function getYPositions(){
    var YPos =[];
    YPos.push($("#a1").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#a2").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#a3").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#a4").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b1").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b2").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b3").css("top").replace(/[^-\d\.]/g, ''));
    YPos.push($("#b4").css("top").replace(/[^-\d\.]/g, ''));
    return YPos;

}*/