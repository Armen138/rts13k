var network = {};
network.connect = function(server) {
socket = new WebSocket(server, "tt.0");
    socket.addEventListener("open", function(event) {      
      	menu.log("connected");
      	socket.send('{"type": "map"}');
        socket.send('{"type": "user", "name": "Guest"}');
    });
    var netId, netName, player;
    socket.addEventListener("message", function(event) {
        try {
            var dataObject = JSON.parse(event.data);    
        } catch(e) {
            console.log(e.message + " :: " + event.data);
        }
    	
        switch(dataObject.type) {
            case "unitreport":
                for(var i = 0; i < dataObject.units.length; i++) {
                    console.log("unit id: " + dataObject.units[i].id);
                    var unit = game.getPlayer(dataObject.units[i].owner).unit(dataObject.units[i].position.X, dataObject.units[i].position.Y, def[dataObject.units[i].name], dataObject.units[i].id);
                    if(dataObject.units[i].path) {
                        unit.setPath(dataObject.units[i].path);
                    }
                }
            break;
            case "credits":
                player.credits = dataObject.credits;
                console.log("credits: " + dataObject.credits);
            break;
            case "energy":
                player.energy = dataObject.energy;
            break;            
            case "map":
                game.mapData = dataObject.map;
            break;
            case "connect":
                menu.log("Player " + dataObject.name + " has joined the game");
                if(dataObject.id !== netId) {
                    console.log("creating player object for id: " + dataObject.id);
                    game.players.push(Player(10, 10, Player.modes.NETWORK, 0, dataObject.id, dataObject.name));
                    socket.send('{"type": "units", "id": ' + dataObject.id + '}'); 
                }
            break;
            case "chat":
                menu.log("[" + dataObject.name + "] " + dataObject.msg);
                break;
            case "player":
                game.init(0);
                console.log(JSON.stringify(dataObject));
                gameView(window.innerWidth, window.innerHeight, game.mapData);
                player = Player(10, 10, Player.modes.LOCAL, dataObject.credits, dataObject.id, dataObject.name);
                game.players.push(player);
                if(dataObject.otherPlayers) {
                    for(var i = 0; i < dataObject.otherPlayers.length; i++) {
                        np = dataObject.otherPlayers[i];
                        game.players.push(Player(0, 0, Player.modes.NETWORK, 0, np.id));
                        socket.send('{"type": "units", "id": ' + np.id + '}');        
                    }
                }
                netId = dataObject.id;
                netName = dataObject.name;
                game.run();            
                socket.send('{"type": "units", "id": ' + netId + '}');
            break;
            case "position":
                var unit = game.getUnit(dataObject.id);
                if(unit) {
                    unit.syncPosition(dataObject.position);    
                } else {
                    socket.send('{"type": "unit", "id": ' + dataObject.id + '}');
                }
            break;
            case "target":
                console.log(dataObject);
                var unit = game.getUnit(dataObject.id);
                if(unit) {
                    unit.target = { X: dataObject.target.X * tileSize, Y: dataObject.target.Y * tileSize };
                }
            break;
            case "unit":
                var unit = game.getUnit(dataObject.id);
                if(unit) {
                    unit.syncPosition(dataObject.position);
                } else {
                    unit = game.getPlayer(dataObject.owner).unit(dataObject.position.X, dataObject.position.Y, def[dataObject.name], dataObject.id);   
                    //game.players[dataObject.owner].
                }
                if(dataObject.path && dataObject.path.length > 0) {
                    unit.setPath(dataObject.path);
                }
            break;
            case "path":
                var unit = game.getUnit(dataObject.id);
                if(unit) {
                    unit.setPath(dataObject.path);    
                } else {
                    socket.send('{"type": "unit", "id": ' + dataObject.id + '}');
                }                
            break;
            default:
                menu.log("Server Says: " + event.data);
            break;    
        }        
    });

        // Display any errors that occur
    socket.addEventListener("error", function(event) {
	    menu.log("Error: " + event);
    });

    socket.addEventListener("close", function(event) {
      	menu.log("Not Connected/Disconnected");
    });

    network.chat = function(msg) {
        socket.send('{"type": "chat", "msg": "'+ msg +'"}');
    };

    network.build = function(position, definition, destination) {
        var buildOrder = {
            "type": "build",
            "position": position,
            "name": definition.name,
            "destination": destination
        };
        socket.send(JSON.stringify(buildOrder));
    };
    network.request = function(msg) {
        socket.send(JSON.stringify(msg));
    };    	
};

Events.attach(network);