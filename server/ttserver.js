#!/usr/bin/env node
var procedural = require('./modules/procedural'),
    Player = require('./modules/player').Player,
    units = require('./modules/definitions').units;



var game = (function() {
    var map = procedural.noiseMap(128, 128, 40, 4),
        players = {},
        gm = {
            addPlayer: function(name, origin) {
                players[origin] = Player(name);
                players[origin].unit(10, 10, units.tank);
                return players[origin];
            },
            unitReport: function(origin) {
                var units = players[origin].units,
                    serializedUnits = [];
                units.each(function() {
                    serializedUnits.push(this.serialized);
                });
                return { "type": "unitreport" , "units": serializedUnits };
            },
            getUnit: function(origin, id) {
                var unit = players[origin].units.find("id", id);
                return unit;                
            }
        };
    Object.defineProperty(gm, "map", {
        get: function() {
            return map;
        }
    });    
    return gm;
}());

var Response = function(type) {
    var response = {
        get serialized() {
            var sd = { type : type };
            for (prop in response) {
                if(prop !== "serialized" && response.hasOwnProperty(prop)) {
                    sd[prop] = response[prop];
                }
            }
            return JSON.stringify(sd);
        }
    }
    return response;
}
var ttServer = (function() {
    var WebSocketServer = require('websocket').server,
        http = require('http'),
        server = null,
        wsServer = null,
        protocol = "tt.0",
        allowedOrigins = ["null", "http://dev138.info"];

    var ttserver =  {
        listen: function(port) {
                server = http.createServer(function(request, response) {
                console.log((new Date()) + ' Received request for ' + request.url);
                response.writeHead(404);
                response.end();
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
                            var mapdata = Response("map");
                                mapdata.map = game.map;
                            connection.sendUTF(mapdata.serialized);   
                        break;
                        case "user":                            
                            var p = game.addPlayer(data.name, request.origin);
                            var player = Response("player");
                            player.id = p.id;
                            player.name = data.name;
                            connection.sendUTF(player.serialized);
                        break;
                        case "units":
                            connection.sendUTF(JSON.stringify(game.unitReport(request.origin)));
                        break;
                        case "unit-go":
                            var unitPath = Response("path"); 
                            var unit = game.getUnit(request.origin, data.id);
                            unitPath.path = unit.go(data.X, data.Y);
                            unitPath.id = data.id;
                            connection.sendUTF(unitPath.serialized());
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