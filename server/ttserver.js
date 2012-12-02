#!/usr/bin/env node
var procedural = require('./modules/procedural'),
    Player = require('./modules/player').Player,
    units = require('./modules/definitions').units,
    Node = require('./modules/nodes.js').Node,
    collision = require('./modules/collision'),
    Message = require('./modules/message').Message,
    game = require('./modules/game').Game,
    MAX_PLAYERS = 4;

//console.log(game.addPlayer);

var ttServer = (function() {
    var WebSocketServer = require('websocket').server,
        http = require('http'),
        server = null,
        wsServer = null,
        protocol = "tt.0",
        allowedOrigins = ["null", "http://dev138.info"];

    var ttserver =  {
        listen: function(port) {
                server = http.createServer(function(request, Message) {
                console.log((new Date()) + ' Received request for ' + request.url);
                Message.writeHead(404);
                Message.end();
            });
            server.listen(port, function() {
                console.log(ttserver.timestamp() + ' Server is listening on port ' + port);
            });

            wsServer = new WebSocketServer({
                httpServer: server,
                autoAcceptConnections: false
            }); 
            wsServer.on('request', ttserver.onRequest);
        },
        timestamp: function() {
            return (new Date()).getTime();
        },
        allowOrigin: function(origin) {            
            return (allowedOrigins.indexOf(origin) !== -1);
        },
        onRequest: function(request) {
            if(!ttserver.allowOrigin(request.origin)) {
                request.reject();
                console.log(ttserver.timestamp() + " connection from origin " + request.origin + " rejected.");
                return;
            }
            if(request.requestedProtocols[0] !== protocol) {                
                request.reject();
                console.log(ttserver.timestamp() + " protocol version mismatch.");
                return;                
            }
            //console.log(request);
            var connection = request.accept(protocol, request.origin),
                player = null;
            console.log(ttserver.timestamp() + ' Connection accepted.');
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    var data;
                    try {
                        data = JSON.parse(message.utf8Data);
                    } catch(e) {
                        console.log("invalid data: " + message.utf8Data);
                        return;
                    }
                    
                    //console.log('Received Message: ' + message.utf8Data);
                    switch(data.type) {
                        case "map":
                            var mapdata = Message("map");
                                mapdata.map = game.map;
                            connection.sendUTF(mapdata.serialized);   
                        break;
                        case "chat":
                            var chat = Message("chat");
                            chat.msg = data.msg;
                            chat.name = player.name;
                            game.broadcast(chat);
                        break;
                        case "user":       
                            var freeSpot = false;
                            for(var i = 0; i < game.players.length; i++) {
                                if(game.players[i].defeated) {
                                    freeSpot = true;
                                }
                            }
                            if(game.players.length < MAX_PLAYERS) {
                                freeSpot = true;
                            }
                            if(!freeSpot) {
                                connection.sendUTF('{"type":"error", "message": "server full"}');
                                connection.close();
                                return;
                            }                            
                            var otherPlayers = game.getPlayers();
                            var name = data.name;
                            if(game.getPlayer(name) !== null) {
                                var seq = 0;
                                while(game.getPlayer(name + seq) !== null) {
                                    seq++;
                                }
                                name = name + seq;                                        
                            }                            
                            player = game.addPlayer(name, connection);
                            var playerMsg = Message("player");
                            playerMsg.id = player.id;
                            playerMsg.name = name;
                            playerMsg.credits = player.credits;
                            playerMsg.otherPlayers = otherPlayers;
                            connection.sendUTF(playerMsg.serialized);
                            var connectMsg = Message("connect");
                            connectMsg.name = name;
                            connectMsg.id = player.id;
                            game.broadcast(connectMsg);
                        break;
                        case "units":                        
                            connection.sendUTF(JSON.stringify(game.unitReport(data.id)));
                        break;
                        case "unit-go":
                            var unitPath = Message("path"); 
                            var unit = game.getUnit(player, data.id);
                            if(unit) {
                                unitPath.path = unit.go(data);
                                unitPath.id = data.id;                                
                            } else {
                                console.log("warning - got move order, but can't find unit");
                            }
                            //connection.sendUTF(unitPath.serialized);
                        break;
                        case "sell": 
                            var unit = game.getUnit(player, data.id);
                            if(unit) {
                                player.credits += unit.cost / 2;
                                unit.die();
                            } else {
                                console.log("trying to sell unit, but can't find it in inventory");
                            }
                            var creditsMsg = Message("credits");
                            creditsMsg.credits = player.credits;
                            player.send(creditsMsg.serialized); 
                        break;
                        case "unit":
                            var unit = game.getUnit(null, data.id);
                            if(unit) {
                                var unitMsg = Message("unit");
                                unitMsg.eat(unit.serialized);
                                connection.sendUTF(unitMsg.serialized);
                            }
                        break;
                        case "build":
                            var definition = units[data.name];
                            if(game.legalPosition(data.position, definition)) {
                                var unit = player.unit(data.position.X, data.position.Y, definition);
                                if(unit && unit.mobile && data.destination) {
                                    unit.go(data.position);
                                }
                                if(unit) {
                                    var unitMsg = Message("unit");
                                    unitMsg.eat(unit.serialized);
                                    connection.sendUTF(unitMsg.serialized);
                                }
                                var creditsMsg = Message("credits");
                                creditsMsg.credits = player.credits;
                                player.send(creditsMsg.serialized);                                
                            } else {
                                var errorMsg = Message("error");
                                errorMsg.message = "You can't build that there.";
                                player.send(errorMsg);
                            }
                        break;
                        default:
                            connection.sendUTF(message.utf8Data.toUpperCase());   
                        break;
                    }
                }
                else if (message.type === 'binary') {
                    console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                    connection.sendBytes(message.binaryData);
                }
            });
            connection.on('close', function(reasonCode, description) {
                
                if(player) {
                    var disconnectMsg = Message("disconnect");    
                    disconnectMsg.name = player.name;
                    disconnectMsg.id = player.id;
                    game.broadcast(disconnectMsg.serialized);
                    player.die();                    
                }
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });            
        },
        stringMessage: function(message) {

        },
        binaryMessage: function(message) {

        }
    };
    return ttserver;
}());

ttServer.listen(8080);
setInterval(game.update, 50);