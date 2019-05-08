// This is some example code on how the library should *kindof* be used

// Note: you have to clone, build, and run the server first
// 
// to build, install ant
// and build using
//
// ant compile
//
// and run using
//
// ant run
//
// you can also user eclipse and use the "import project" functionality
//
// the server opens on port 8081
//

// create a client with all the callbacks
// syntax: host, port, onError, onQuestion, onSection, onDone, onScore
var client = new Client("localhost", 8081, function(error) { 
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

// connect with a username and a onConnected callback
client.connect("foobar" /* username */, function() { 
    console.log("Connected");

    // Show the main screen with the join / create game


    //Let's pretend

    // If create game gets picked:


    //Let's get a list of sections to choose from
    client.getSections(function(sections /* an array of sections (use getName())*/ ) {
	// display the sections options
	
    });
    
    client.getTypes(function(types /* an array of question types, (use getName())*/ ) {
	// display the type options
    });

    //Let's pretend the create button was pressed
    var gameName = "myGameName";
    var isPublic = true; // Whether other people should be able to get
    var questionsPerSection = 10; // Questions to generate per section, use -1 for all possible questions

    var sections = []; // An array of sections, based on those retrieved by getSections()
    var types = []; // An array of types, based on those retrieved by getTypes()

    client.startGame(gameName, isPublic, questionsPerSection, sections, types, function() {
	console.log("The game was started!");
	
	// Let's play the game
	playGame();
    });

    // If the join game button was pressed

    client.getGames(function(games) {
	// an array of Games
	// show the game list
    });

    // when game selected and join button pressed
    var game = ... some game
    
    client.joinGame(game, function() {
	//We've joined
	playGame();
    });

});

function playGame() {
    // Switch to game screen
    
    // Request the first question
    client.requestNextQuestionBatch();
    // will call onQuestion callback
    // as well as onSection callback

    // when the user submits an answer:
    client.submitAnswer(questionIndex /* the question index */, 1 /* the choice index */, function(response) {
	//adjust the score according to response
	//request the next question
	client.requestNextQuestionBatch();
    });
}
