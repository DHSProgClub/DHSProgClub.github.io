var Type = function(name) {
    this._name = name;
}

Type.prototype.getName = function() { return this._name; }

var Section = function(client, name) {
    this._client = client;
    this._name = name;
};

Section.prototype.getName = function() { return this._name; }

var Game = function(client, json) {
    this._client = client;
    this._name = json.name;
    this._id = json.gameID;
    this._sections = json.sections;
    this._isPublic = json.isPublic;
    this._questionsPerSection = json.questionsPerSection;
};

Game.prototype.getName = function() { return this._name; }
Game.prototype.getID = function() { return this._id; }

var Client = function(host, port, onError, onQuestionBatch, onSection, onDone, onScores) {
    this._id = -1;
    this._host = host;
    this._port = port;
    this._onError = onError;

    this._onQuestionBatch = onQuestionBatch;
    this._onSection = onSection;
    this._onDone = onDone;
    this._onScores = onScores;

    this._pollerID = -1;
};

Client.prototype.handleError = function(error) {
    this._onError(error);
};

Client.prototype.get = function(uri, callback) {
    var theUrl = "http://" + this._host + ":" + this._port + uri;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    var text = xmlHttp.responseText;
	    var json = JSON.parse(text);
            callback(json);
	}
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
};

Client.prototype.connect = function(name, onConnect) {
    var client = this;
    this.get("/api/connect?name=" + encodeURIComponent(name), function(response) {
	if (response.type == "connected") {
	    client._id = response.data.id;
	    
	    // Start the polling for new events
	    var poller = client.checkEvents.bind(client);
	    
	    // check for new events every 500ms
	    client._pollerID = setInterval(poller, 500);

	    if (onConnect) onConnect();
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};

Client.prototype.disconnect = function(onDisconnect) {
    this.get("/api/disconnect?id=" + this._id, function(response) {
	if (response.type == "disconnected") {
	    clearInterval(this._pollerID);
	    this._pollerID = -1;

	    onDisconnect();
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};

Client.prototype.getSections = function(onSections) {
    this.get("/api/getSections?id=" + this._id, function(response) {
	if (response.type == "sections") {
	    var sections = [];
	    for (var i = 0; i < response.data.length; i++) {
		var s = response.data[i];
		sections.push(new Section(this, s.name));
	    }
	    onSections(sections);
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};

Client.prototype.getTypes = function(onTypes) {
    this.get("/api/getTypes?id=" + this._id, function(response) {
	if (response.type == "types") {
	    var types = [];
	    for (var i = 0; i < response.data.length; i++) {
		var t = response.data[i];
		types.push(new Type(t));
	    }
	    onTypes(types);
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });    
};

Client.prototype.getGames = function(onGames) {
    this.get("/api/getGames?id=" + this._id, function(response) {
	if (response.type == "games") {
	    var games = [];
	    for (var i = 0; i < response.data.length; i++) {
		var g = response.data[i];
		types.push(new Game(this, g));
	    }
	    onGames(games);
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });    
};

//Will start and join a game
Client.prototype.startGame = function(gameName, isPublic, numQuestions, sections, types, onGameStarted) {
    var uri = "/api/startGame?id=" + this._id;
    uri += "&name=" + encodeURIComponent(gameName);
    uri += "&public=" + isPublic;
    uri += "&numQuestions=" + numQuestions;
    var sectionsString = "";

    for (var i = 0; i < sections.length; i++) {
	if (i == sections.length - 1) sectionsString += sections[i].getName();
	else sectionsString += sections[i].getName() + ";";
    }

    uri += "&sections=" + sectionsString;

    var sectionsString = "";

    for (var i = 0; i < sections.length; i++) {
	if (i == sections.length - 1) sectionsString += sections[i].getName();
	else sectionsString += sections[i].getName() + ";";
    }

    uri += "&sections=" + sectionsString;

    

    this.get(uri, function(response) {
	if (response.type == "gameStarted") {
	    var game = new Game(this, response.data);
	    onGameStarted(game);
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });    
};

// game can either be a game or an id
Client.prototype.joinGame = function(game, onJoined) {
    var gameID = 0;
    if (typeof(game) === "number") {
	gameID = game;
    } else {
	gameID = game.getID();
    }
    this.get("/api/joinGame?id=" + this._id + "&gameID=" + gameID, function(response) {
	if (response.type == "joined") {
	    onJoined();
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });    
};

Client.prototype.leaveGame = function(onLeft) {
    this.get("/api/leaveGame?id=" + this._id, function(response) {
	if (response.type == "left") {
	    onLeft();
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};

// the onQuestion suppled to joinGame will be called
Client.prototype.requestNextQuestionBatch = function() {
    this.get("/api/advanceQuestionBatch?id=" + this._id, function(response) {
	if (response.type == "questionBatchAdvanced") {
	    this.checkEvents();
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};

Client.prototype.submitAnswer = function(answerIndex, onResult) {
    this.get("/api/submit?id=" + this._id, "&answer=" + answerIndex, function(response) {
	if (response.type == "submitted") {
	    onResult(response.data);
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};

Client.prototype.checkEvents = function() {
    this.get("/api/events?id=" + this._id, function(response) {
	if (response.type == "events") {
	    var events = response.data;
	    for (var i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.event == "questionBatch") {
		    this._onQuestionBatch(event.data);
		} else if (event.event == "section") {
		    this._onSection(event.data);
		} else if (event.event == "scores") {
		    this._onScores(event.data);
		} else if (event.event == "done") {
		    this._onDone();
		}
	    }
	} else if (response.type == "error") {
	    this.handleError(response);
	}
    });
};
