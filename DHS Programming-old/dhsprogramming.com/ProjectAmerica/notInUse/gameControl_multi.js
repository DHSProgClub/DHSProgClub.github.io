var usernameScreen = $("#usernameScreen");
var multiplayerScreen = $("#multiplayerScreen");
var joinScreen = $("#joinScreen");
var createScreen = $("#createScreen");

// Some screen utility fucntions
function transitionScreens(screenA, screenB) {
    screenA.addClass("hidden");
    screenB.removeClass("hidden");
}


var onError = function(error) {
    console.log("Error " + error);
}

var onQuestionBatch = function(questions) {
    
}

var onSection = function(section) {

}

var onDone = function() {
}

var onScores = function() {
}

//var client = new Client("localhost", 8081, onError, onQuestionBatch, onSection, onDone, onScores);
var client = new Client("project-america.herokuapp.com", 80, onError, onQuestionBatch, onSection, onDone, onScores);

//Listen for the connect button

$("#connectButton").click(function(){
    var username = $("#username").val();

    if (username.length != 0) {
	console.log("Connecting with: " + username);
	client.connect(username, function() {
	    console.log("Connected!");

	    transitionScreens(usernameScreen, multiplayerScreen);
	});
    } else {
	alert("Please type in a username!");
    }
});

// List for the create game button

$("#createScreenButton").click(function() {
    loadCreateScreen();
    transitionScreens(multiplayerScreen, createScreen);
});

$("#joinScreenButton").click(function() {
    loadJoinScreen();
    transitionScreens(multiplayerScreen, joinScreen);
});

$("#multiplayerBack").click(function() {
    //Disconnect
    client.disconnect(function() {
	transitionScreens(multiplayerScreen, usernameScreen);
    });
});

// Initialize the join page

function loadJoinScreen() {

}

$("#joinBack").click(function() {
    transitionScreens(joinScreen, multiplayerScreen);
});

// Initialize the create page

function loadCreateScreen() {
    var sections = $("#sections");
    var types = $("#types");

    sections.empty();
    types.empty();

    function createSection(name) {
	sections.append("<div class=\"createOption\">" + name + "<input type=\"checkbox\" class=\"createCheckbox\" id=\"useSection" + name + "\"></input></div>");
    }

    function createType(name) {
	types.append("<div class=\"createOption\">" + name + "<input type=\"checkbox\" class=\"createCheckbox\" id=\"useType" + name + "\"></input></div>");
    }

    client.getSections(function(sections) {
	for (var i = 0; i < sections.length; i++) {
	    var name = sections[i].getName();
	    createSection(name);
	}
    });

    client.getTypes(function(types) {
	for (var i = 0; i < types.length; i++) {
	    var name = types[i].getName();
	    createType(name);
	}
    });
}

$("#createBack").click(function() {
    transitionScreens(createScreen, multiplayerScreen);
});

console.log("Controls initialized");
