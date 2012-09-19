#!/usr/bin/env node
var procedural = {},
    Player = require('./modules/player.js').Player,
    units = require('./modules/definitions.js');

procedural.noiseMap = function(w, h, res, lvl) {
    var map = [],
        noiseMaker = require('./modules/simplex'),
        noise = new noiseMaker.SimplexNoise();
    for(var x = 0; x < w; x++) {
        map[x] = [];
        for(var y = 0; y < h; y++) {
            map[x][y] = parseInt((((noise.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
        }
    }
    return map;
};

var playRound = (function() {
    var map = procedural.noiseMap(128, 128, 40, 4),
        players = [],
        round = {
            addPlayer: function(id) {
                var player = Player(0);
                player.unit(10, 10, units.tank);
                return player;
            }
        };
    Object.defineProperty(round, "map", {
        get: function() {
            return map;
        }
    });    
    return round;
}());

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
                    console.log('Received Message: ' + message.utf8Data);
                    switch(message.utf8Data) {
                        case "map":
                            var mapdata = { map: playRound.map };    
                            connection.sendUTF(JSON.stringify(mapdata));   
                        break;
                        default:
                            connection.sendUTF(message.utf8Data.toUpperCase());   
                        break;
                    }
                    //connection.sendUTF(message.utf8Data.toUpperCase());
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