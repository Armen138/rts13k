#!/usr/bin/env node
var procedural = require('./modules/procedural'),
    Player = require('./modules/player').Player,
    units = require('./modules/definitions').units,
    Node = require('./modules/nodes.js').Node,
    collision = require('./modules/collision'),
    Message = require('./modules/message').Message,
    game = require('./modules/game').Game;

console.log(game.addPlayer);

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
            var connection = request.accept(protocol, request.origin);
            console.log(ttserver.timestamp() + ' Connection accepted.');
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    var data = JSON.parse(message.utf8Data);
                    console.log('Received Message: ' + message.utf8Data);
                    switch(data.request) {
                        case "map":
                            var mapdata = Message("map");
                                mapdata.map = game.map;
                            connection.sendUTF(mapdata.serialized);   
                        break;
                        case "user":                            
                            var p = game.addPlayer(data.name, request.origin, connection);
                            var player = Message("player");
                            player.id = p.id;
                            player.name = data.name;
                            player.credits = p.credits;
                            connection.sendUTF(player.serialized);
                        break;
                        case "units":
                            connection.sendUTF(JSON.stringify(game.unitReport(request.origin)));
                        break;
                        case "unit-go":
                            var unitPath = Message("path"); 
                            var unit = game.getUnit(request.origin, data.id);
                            unitPath.path = unit.go(data);
                            unitPath.id = data.id;
                            connection.sendUTF(unitPath.serialized);
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