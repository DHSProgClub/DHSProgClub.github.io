
//Sizing

var marginX = window.innerWidth/4;
var marginY = window.innerHeight/4;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

//For ajax purposes
var firstGame = true;

//controls scoring 
var deduction = 0.1; //percent deduction for wrong answers
var stdScore = 100; //score for question without bonuses or deductions

//keeps track of score
var currentScore=0;

//keeps track of the number of wrong answers for each question
var numWrong=0;

//Timer
var timeElapsed=0;

//for every second less than stdtime you use, you get a score bonus of 5 points
var stdtime=30;
var speedBonus =5;

//time spent on question
var questionTime=0;
//true during gameplay, for timer use
var inGame;

//Set to false at the start of question, true when correct: control gameplay
var q1=false;
var q2=false;

//controls question number
var qSet = 1;
//Temporary question control. count1 is odd, count2 is even
/*var count1=-1;
var count2=0;
*/
//Question Limit
var qLimit;

//Game settings
var selection; //[era id string, battles boolean, inventions boolean, elections boolean, court boolean, other boolean, length string]

//JSON with all data being used in the game (Created from master set with selection settings)
var gameEvents;

//current game's categories
var categories=[];

//questions that have been asked
var askedQuestions =[];

//controls follow-up question for battles
var followup=false;

//set to number corresponding to event after questions are set up. 
//always set but only used for battles
var prevEvent;

//number of available questions for the game
var numAvailableQs;

//All bubbles
var tiles=["#a1", "#a2", "#a3", "#a4", "#b1", "#b2", "#b3", "#b4"];

//All the history!
var master;

//creates client
/*
var client = new Client("project-america.herokuapp.com", 80, function(error) { 
    console.log("Error " + error);

}, function(question) { // onQuestionBatch received
    console.log("Received question batch " + question);
    // Show the question
    
    // ... see playgame() for how to submit a response
}, function(section) { // onSection
    console.log("Received section " + section);
    // Change to that section (background, etc.)

}, function() { // onDone
    // Change to scoreboard, we're done
    console.log("Done!");

}, function(scores) { // onScore
    console.log("Received scores " + scores);
    // Update the scores

});
*/

//idk how usernames are gonna work
var username="yay";


$(document).ready(function(){
    gameSetup();
    setupEscape();
});

function setupEscape(){
    $(document).keyup(function(e){
       if(e.keyCode === 27){
           toScore();
       } 
    });
}

function gameSetup(){
   /* client.connect(username, function() { 
    console.log("Connected");

    });
    */
    
    
    $(".create").click(function(){

        $(".startContainer").hide();
        $(".eraChoice").show();

        $(".eraOption").click(function(){
        
            var era = this.id;
            
            $(".eraChoice").hide();
            $(".settings").show();
        
            $(".goButton").click(function(){
                var battles = $('#battles')[0].checked;
                var inventions = $('#inventions')[0].checked;
                var elections = $('#elections')[0].checked;
                var court = $('#court')[0].checked;
                var other = $('#other')[0].checked;
                var length = $('input[name="length"]:checked', '#lengthForm').val();
                selection = [era, battles, inventions, elections, court, other, length];
                
                eraBackground(era);
                
                getEvents();
            });
        });
    });

}

function getEvents(){ //Working! (At least w/ server)
    //Create data set for game from master set
    
    if(firstGame){

        $.ajax({
            url:"json/USHistory.json",
            dataType:"text",
            async: true,
            success:function(data){

                firstGame = false;
            
                master = JSON.parse(data);

                setupData();

            }
        });
    }
    else{
        setupData();
    }
}

function setupData(){
    var era;

    if(selection[0]==="era1"){
        //Set newEvents = to JSON Object only containing that era
        era = master.era1;
    }
    else if(selection[0]==="era2"){
        era = master.era2;
    }
    else if(selection[0]==="era3"){
      era = master.era3;
    }
    else if(selection[0]==="era4"){
        era = master.era4;
    }
    else if(selection[0]==="era5"){
        era = master.era5;
    }

    //var blankCopy = '{"battles" : [],"inventions" : [],"elections" : [],"court": [], "other" : [] }';

    //var newCopy=JSON.parse(blankCopy);

    if(selection[1]===true){
        //newCopy["battles"] = era.battles;
        categories.push("battles");
    }
    if(selection[2]===true){
        //newCopy["inventions"] = era.inventions;
        categories.push("inventions");
    }
    if(selection[3]===true){
        //newCopy["elections"] = era.elections;
        categories.push("elections");
     }
    if(selection[4]===true){
        //newCopy["court"] = era.court;
        categories.push("court");
    }
    if(selection[5]===true){
        //newCopy["other"] = era.other;
         categories.push("other");
    }

    //gameEvents = newCopy;
    gameEvents = era;

    setupFinal();
}

function setupFinal(){
    setQuestionLimit(length);
    qSet=1;
    $(".pregame").hide();
    $("body").css("overflow-y", "hidden");
    $(".game").show();
    gameStart();
}

function gameStart(){
    timeElapsed=0;
    currentScore=0;
    inGame = true;
    startTimer();
    $(".game").show();
    questionSetup();
}

//called once at start of game
function startTimer(){
    $( "p.timeText" ).html("Time: "+timeElapsed);
    var timer= setInterval(function() {
        timeElapsed++;
        questionTime++;
        if(inGame){
            $( "p.timeText" ).html("Time: "+timeElapsed);
        }
    }, 1000);
}

function setQuestionLimit(){
    var limit = selection[6];
    numAvailableQs=0;
    for(var i=0;i<categories.length;i++){
        numAvailableQs += gameEvents[categories[i]].length;
    }
    
    if(limit==="quick"){
        qLimit = 10;
    }
    else if(limit==="medium"){
        qLimit = 20;
    }
    else if(limit==="long"){
        qLimit = 30;
    }
    else{
        qLimit = numAvailableQs; //Code to use every event
    }
}

//Correct is the current event whose information is correct for all questions
//type is string with type of question, all lowercase. 
//isNotable is for notable facts. if isNotable, type is either "election" or "battle"

function genFalseAnswers(type, isNotable, correct){

    var usedAnswers=[];
    var numAnswers = 4; 
    var timeout = 0;
    var timeoutFallback = 1000;
    var timeoutMax = 1500;

    if(isNotable){ 
         usedAnswers = correct.notables;
         var numNotables =correct.notables.length;
            
        while(timeout < timeoutMax && (usedAnswers.length - (numNotables -1))< numAnswers){
    
            var potential;
            
            if(timeout<timeoutFallback){
                potential = getRanNotable(type);
            }
            else{ //Normal fact related to question couldn't be found in reasonable amount of searches. Using more general facts.
                potential = getFallbackFact();
            }
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
                
            timeout++;
                
        }
        
        if(timeout>timeoutMax){
            usedAnswers.push(-1); 
        }
        
        var falseAnswers = usedAnswers.splice((correct.notables.length-(numAnswers-1)), usedAnswers.length); //Remove correct notable facts from array
        return falseAnswers;

    }
    else{
        usedAnswers.push(correct[type]);
            
        while(timeout < timeoutMax && usedAnswers.length-1 < numAnswers){
                
            var potential;
            
            if(timeout < timeoutFallback){
                potential = getRanFact(type);
            }
            else if(!(type==="year" || type=="location")){
                potential = getFallbackFact();
            }
            
            if(notUsed(potential, usedAnswers)){
                usedAnswers.push(potential);
            }
            
            timeout++;
        }
        
        if(timeout>timeoutMax){ //If nothing was found in a large number of searches, hide the bubble
            usedAnswers.push(-1);  //Bubble hiding code
        }
        
        var falseAnswers = usedAnswers.splice(1, usedAnswers.length);
        
        return falseAnswers;
    }
   
}


function questionSetup(){

    resizeTiles();
    
    //console.log("questions");
    //console.log(qLimit);
    //console.log(qSet);
    //console.log(numAvailableQs);
    $(".answerBox1").removeClass( "answerBox1Dropped" );
    $(".answerBox2").removeClass( "answerBox2Dropped" );

    var addScore=0;
    var time=0;
    if(qSet>1){
        if(questionTime<stdtime){
            time=stdtime-questionTime;
        }
       addScore = calculateScore(numWrong,time);
    }

    updateScore(addScore);
    numWrong=0;
    questionTime=0;

    if(qSet>numAvailableQs){
        toScore();
    }
    
    if(qSet <= qLimit){

        qSet++;
        
        for(var x = 0; x < tiles.length; x++){
            setBlock(tiles[x]);
        }

        dragManager();
        //Put name of event at top
        //Setup question boxes and correct answer bubbles

        var randoms = getRanEvent(); //randoms[0] is category number, randoms[1] is event number
        var cat= categories[randoms[0]];
        var ranEvent= randoms[1];
        var questions = getQuestions(randoms[0]);
        var falseAnswersA=[];
        var falseAnswersB=[];
        var qA=(questions[0].toLowerCase()).replace(':', '');
        var qB=(questions[1].toLowerCase()).replace(':', '');

        $('#questionBox td').eq(0).html(questions[0]);
        $('#questionBox td').eq(2).html(questions[1]);
        

        if(followup){


                $("p.eventText").html(gameEvents["battles"][prevEvent].name + ": Set Two");

                 $( "#a1" ).html(gameEvents.battles[prevEvent][qA]);
                 falseAnswersA=genFalseAnswers(qA,false,gameEvents.battles[prevEvent]);

    

            addFalseAnswers("#a", falseAnswersA)
            $( "#b1" ).html(gameEvents.battles[prevEvent].notables[Math.floor(Math.random()*gameEvents.battles[prevEvent].notables.length)]); 

            falseAnswersB = genFalseAnswers("battles", true,gameEvents.battles[prevEvent]);
            addFalseAnswers("#b", falseAnswersB);
            followup=false;


        }
        else{

            if(cat==="battles"){ 

                followup=true;
               
             }

             if(cat =="elections"){

             }

            $("p.eventText").html(gameEvents[cat][ranEvent].name);
        
            var theEvent = gameEvents[cat][ranEvent];
            $( "#a1" ).html(gameEvents[cat][ranEvent][qA]);
            falseAnswersA=genFalseAnswers(qA, false, theEvent);
            addFalseAnswers("#a", falseAnswersA);
                
            
            if(cat==="elections"){

                $( "#b1" ).html(theEvent.notables[Math.floor(Math.random()*theEvent.notables.length)]);
                falseAnswersB=genFalseAnswers("elections", true, theEvent);
            }
            else{

                $( "#b1" ).html(gameEvents[cat][ranEvent][qB]);
                falseAnswersB=genFalseAnswers(qB, false, theEvent);
            }
            addFalseAnswers("#b", falseAnswersB);
            

            }

            prevEvent= ranEvent;
            
            sizeTiles();

    }

    else{
        toScore();
    }   
   
}

function notUsed(potential, usedAnswers){
    for (var i=0;i<usedAnswers.length;i++){ 
        if(potential === usedAnswers[i]){
            return false;
        }
    }
    return true;
}

function addFalseAnswers(AorB, falseAnswers){ //Usage AorB = "#a" or "#b"
    var idStartNum = 2;
    var max = 3; //Number of false answers needed
    var x;
    var hideRemaining = false;

    for(idStartNum, x = 0; x <max; idStartNum++, x++){
        if(hideRemaining){ //Nothing left in array, hide rest of bubbles
            $(AorB+idStartNum).hide();
        }
        else if(falseAnswers[x] === -1){ //Code for nothing found
            $(AorB+idStartNum).hide();
            hideRemaining = true;
        }
        else{
            $(AorB+idStartNum).text(falseAnswers[x]);   
        }
    }
}


//type is the fact type as a string, all lowercase
function getRanFact(type){
    var ranEvent = getRanAnsEvent(type);

    return gameEvents[ranEvent[0]][ranEvent[1]][type];


}

function getRanNotable(type){

    var index = Math.floor(Math.random()*gameEvents[type].length);
    var index2 = Math.floor(Math.random()*gameEvents[type][index].notables.length);
    return gameEvents[type][index].notables[index2];

}

//returns [category, event random number].
function getRanAnsEvent(type){
    var category="";
    if(type==="year"){
        var ran = Math.random();
        if(ran>0.75){
            category="battles";
        }
        else if(ran>0.5){
            category="other";
        }
        else if(ran>0.25){
            category="inventions";
        }
        else{
            category="court";
        }
    }
    else if(type==="location" || type==="victor" || type==="loser"){
        category="battles";
    }
    else if(type==="result"){
        category="elections";
    }
    else if(type==="impact"){
        category="inventions";
    }
    else if(type==="significance"){
        category="other";
    }
    else if(type==="ruling"){
        category="court";
    }

    ranEvent = Math.floor(Math.random() * gameEvents[category].length);
    return [category,ranEvent];
}


//returns [category random number, event random number].
function getRanEvent(){
    var ranCategory = Math.floor(Math.random() * categories.length);
    var category = categories[ranCategory];
    var ranEvent = Math.floor(Math.random() * gameEvents[category].length);
    var timeout = 0;
    var timeoutMax = 2000;
    
    while(timeout < timeoutMax && alreadyAsked(gameEvents[category][ranEvent].name)){
        ranCategory = Math.floor(Math.random() * categories.length);
        category = categories[ranCategory];
        ranEvent = Math.floor(Math.random() * gameEvents[category].length);
        
        timeout++;
    }

    if(timeout > timeoutMax){ //Couldn't get event that wasn't already used - end game
        toScore();
    }
    
    askedQuestions.push(gameEvents[category][ranEvent].name);

    return [ranCategory,ranEvent];

}

function alreadyAsked(eventName){

    for(var i=0; i<askedQuestions.length;i++){
        if(askedQuestions[i]===eventName){
            return true;
        }
    }
    return false;
}

//parameter: random number corresponding to category. if follow up, number doesn't matter
function getQuestions(ranCategory){
    if(followup){
        var ranQuest="";
        if(Math.random()<0.5)
            ranQuest="Victor:";
        else
            ranQuest="Loser:";
        return [ranQuest,"Notable Fact:"];

    }
    else{
        if(categories[ranCategory]==="battles"){
            return ["Year:", "Location:"];
        }

        else if(categories[ranCategory]==="inventions"){
            return ["Year:", "Impact:"];
        }

        else if(categories[ranCategory]==="elections"){
            return ["Result:", "Notable Fact:"];
        }

        else if(categories[ranCategory]==="court"){
            return ["Year:","Ruling:"];
        }

        else if(categories[ranCategory]==="other"){
            return ["Year:","Significance:"];
        }
    }

}

function getFallbackFact(){
    var category = Math.floor(Math.random()*5)+1; //Randomly pick from categories
    
    if(category === 1){ //Battle
        return getRanNotable("battles");
    }
    else if(category === 2){ //Invention
        return getRanFact("impact");
    }
    else if(category === 3){ //Election
        return getRanNotable("elections");
    }
    else if(category === 4){ //Court Case
        return getRanFact("ruling");
    }
    else if(category === 5){ //Other
        return getRanFact("significance");
    }
}

function isCorrect(ans){
    //temporary implementation 
    return $(ans).hasClass("correct");
}

//time is 30-time spent, or 0 if more than 30 seconds were spent
function calculateScore(numWrong, time){
     var score = stdScore - (stdScore * deduction * numWrong);
     score = score + (speedBonus * time);
     return score;

 
}

function updateScore(newScore){
   currentScore+=newScore;
   $( "p.scoreText" ).html("Score: "+currentScore);
}

function sizeTiles(){
    for(var x = 0; x < tiles.length; x++){
        var tile = tiles[x];
        
        while(($(tile).height()/window.innerHeight)*100 > 12){
            var size = parseInt($(tile).css("font-size"));
            $(tile).css("font-size", size-.1);
            
            var width = $(tile).width();
            $(tile).width(width+20);
        }
    }
}

function resizeTiles(){
    for(var x = 0; x < tiles.length; x++){
        var tile = tiles[x];
        
        $(tile).css("width", "10%");
        $(tile).css("font-size", "1.2em");
        
    }
}
