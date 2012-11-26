var network = {};
network.connect = function(server) {
socket = new WebSocket(server, "tt.0");
    socket.addEventListener("open", function(event) {      
      	menu.log("connected");
      	socket.send('{"request": "map"}');
        socket.send('{"request": "user", "name": "Armen"}');
    });

    socket.addEventListener("message", function(event) {
    	var dataObject = JSON.parse(event.data),
            netID = 0;
        switch(dataObject.type) {
            case "unitreport":
                for(var i = 0; i < dataObject.units.length; i++) {
                    console.log("unit id: " + dataObject.units[i].id);
                    game.players[0].unit(dataObject.units[i].position.X, dataObject.units[i].position.Y, def[dataObject.units[i].name], dataObject.units[i].id);
                }
            break;
            case "map":
                game.mapData = dataObject.map;
            break;
            case "connect":
                menu.log("Player " + dataObject.name + " has joined the game");
                if(dataObject.id !== netId) {
                    console.log("creating player object for id: " + dataObject.id);
                    game.players.push(Player(10, 10, Player.modes.NETWORK, 0, dataObject.id))                    
                }

            break;
            case "player":
                game.init(0);
                gameView(window.innerWidth, window.innerHeight, game.mapData);
                game.players.push(Player(10, 10, Player.modes.LOCAL, dataObject.credits, dataObject.id));
                if(dataObject.otherPlayers) {
                    for(var i = 0; i < dataObject.otherPlayers.length; i++) {
                        np = dataObject.otherPlayers[i];
                        game.players.push(Player(0, 0, Player.modes.NETWORK, 0, np.id));        
                    }
                }
                netId = dataObject.id;
                game.run();            
                socket.send('{"request": "units"}');
            break;
            case "position":
                var unit = game.getUnit(dataObject.id);
                if(unit) {
                    unit.syncPosition(dataObject.position);    
                } else {
                    socket.send('{"request": "unit", "id": ' + dataObject.id + '}');
                }
            break;
            case "unit":
                var unit = game.getUnit(dataObject.id);
                if(unit) {
                    unit.syncPosition(dataObject.position);
                } else {
                    game.getPlayer(dataObject.owner).unit(dataObject.position.X, dataObject.position.Y, def[dataObject.name], dataObject.id);   
                    //game.players[dataObject.owner].
                }
            break;
            case "path":
                var unit = game.getUnit(dataObject.id);
                unit.setPath(dataObject.path);
            break;
            default:
                menu.log("Server Says: " + event.data);
            break;    
        }
        /*
        if(dataObject.player) {
            game.init(0);
            gameView(window.innerWidth, window.innerHeight, game.mapData);
            game.players.push(Player(10, 10, Player.modes.LOCAL));
            game.run();            
            socket.send('{"request": "units"}');
        }
        if(dataObject.type === "unitreport") {
        }
    	if(dataObject.map) {
            game.mapData = dataObject.map;    		
    	} else {
            menu.log("Server Says: " + event.data);    
        }
       */ 
        
    });

        // Display any errors that occur
    socket.addEventListener("error", function(event) {
	    menu.log("Error: " + event);
    });

    socket.addEventListener("close", function(event) {
      	menu.log("Not Connected/Disconnected");
    });


    network.request = function(msg) {
        socket.send(JSON.stringify(msg));
    };    	
};

Events.attach(network);