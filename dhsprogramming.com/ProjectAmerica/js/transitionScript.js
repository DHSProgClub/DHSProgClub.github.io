function toScore(){
    console.log("score");
    $("#yourScore").text("Your Score: " + currentScore);
    $(".game").hide();
    $(".scoreBoard").show();
    $("body").css("overflow-y", "visible");
    inGame=false;
    $(".returnOption").click(function(){
        resetGame();
        backToMenu();
    });
}

function backToMenu(){
    $(".scoreBoard").hide();
    $(".pregame").show();
    $(".eraChoice").hide();
    $(".settings").hide();
    $(".startContainer").show();
    gameSetup(); //The cycle never ends! What is life?
}

function resetGame(){
    currentScore = 0;
    questionTime=0;
    timeElapsed = 0;
    categories=[];
    askedQuestions=[];
    $(document.body).css('background-image','url(img/HomeInTheWoods.jpg)');
}

function eraBackground(era){
    
    var ranImage = Math.floor(Math.random()*3)+1; //Random selection from 3 possible backgrounds
    
    if(era === "era1"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era1/CrossingDelaware.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era1/DeclarationOfIndependence.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era1/SurrenderOfGeneralBurgoyne.jpg)');
        }
    }
    else if(era === "era2"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era2/AndrewJackson.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era2/EmigrantsCrossingThePlains.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era2/HenryClay.jpg)');
        }
    }
    else if(era === "era3"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era3/Gettysburg.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era3/McKinley.png)');
        }
        else{
            $(document.body).css('background-image','url(img/era3/SouthManchuriaRailway.jpg)');
        }
    }
    else if(era === "era4"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era4/Coca-Cola.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era4/Coolidge.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era4/FlagRaising.jpg)');
        }
    }
    else if(era === "era5"){
        if(ranImage === 1){
            $(document.body).css('background-image','url(img/era5/Nixon-Johnson.jpg)');
        }
        else if(ranImage === 2){
            $(document.body).css('background-image','url(img/era5/Reagan.jpg)');
        }
        else{
            $(document.body).css('background-image','url(img/era5/Unix.jpg)');
        }
    }
}