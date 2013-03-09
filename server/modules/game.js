var procedural = require('./procedural'),
    Player = require('./player').Player,
    definitions = require('./definitions').units,
    Node = require('./nodes.js').Node,
    Message = require('./message.js').Message,
    collision = require('./collision'),
    bt = require('./basictypes.js'),
    http = require('http'),
    lobby = "13tanks.com";

var map = procedural.noiseMapFine(128, 128, 50, 4),
    players = [],
    units = Node(),
    positions = [
        {X: 10, Y: 10},
        {X: 10, Y: 118},
        {X: 118, Y: 118},
        {X: 118, Y: 10}
    ],
    game = {
        bytecount: 0,
        get players(){
            return players;
        },
        lobby: function(data, cb) {
            var dataSerialized = JSON.stringify(data);
            var options = {
                hostname: lobby,
                port: 80,//10138,
                path: "/register.json",
                method: "POST",
                headers: {
                    "Content-Length" : dataSerialized.length
                }
            };
            var request = http.request(options, function(res) {
                //console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log('BODY: ' + chunk);
                    if(cb) {
                        try {
                            cb(JSON.parse(chunk));
                        } catch(e) {
                            console.log("failed to register at lobby server");
                            cb({error: true});
                        }
                        
                    }
                });
            });
            request.write(dataSerialized);
            request.on("error", function(e) {
                logger.info("Lobby server down? " + e.message);
                cb({error: true});
            });
            request.end();
        },
        update: function() {
            for(var i = 0; i < players.length; i++) {
                if(!players[i].defeated) {
                    players[i].update();
                } else {
                    players[i].kick();
                }

            }
        },
        broadcast: function(msg) {
            for(var i = 0; i < players.length; i++) {
                players[i].send(msg);
            }
        },
        getPlayer: function(id) {
            for(var i = 0; i < players.length; i++) {
                if(players[i].id === id || players[i].name === id) {
                    return players[i];
                }
            }
            return null;
        },
        getPlayers: function() {
            var serializedPlayers = [];
            for(var i = 0; i < players.length; i++) {
                if(!players[i].defeated) {
                    serializedPlayers.push({
                        "name" : players[i].name,
                        "id": players[i].id
                    });
                }
            }
            return serializedPlayers;
        },
        addPlayer: function(session /*name*/, connection, cb) {
            game.lobby({
                "type": "ident",
                "session": session
            }, function(data) {
                playerId = 0;
                var i,
                    name = data.error ? "Guest" : data.nickname;

                if(game.getPlayer(name) !== null) {
                    var seq = 0;
                    while(game.getPlayer(name + seq) !== null) {
                        seq++;
                    }
                    name = name + seq;
                }

                for(i = 0; i < players.length; i++) {
                    if(players[i].defeated) {
                        playerId = i;
                    }
                }
                if(playerId === 0) {
                    playerId = players.length;
                }
                var otherPlayers = game.getPlayers();
                var player = Player(name, game, connection, playerId);
                if(!positions[playerId]) {
                    console.log("no position available");
                    player.send("no player positions available");
                    player.kick();
                } else {
                    var p1 = game.spiral(13, positions[playerId]);
                    players[playerId] = player;
                    player.on("unit-update", game.unitUpdate);

                    for(i = 0; i < 13; i++) {
                        units.add(player.unit(p1[i].X, p1[i].Y, definitions.tank, true));
                    }
                }

                //broad cast player connect
                var playerMsg = Message("player");
                playerMsg.id = player.id;
                playerMsg.name = player.name;
                playerMsg.credits = player.credits;
                playerMsg.otherPlayers = otherPlayers;
                connection.sendUTF(playerMsg.serialized);
                var connectMsg = Message("connect");
                connectMsg.name = name;
                connectMsg.id = player.id;
                game.broadcast(connectMsg);

                if(cb) {
                    cb(player);
                }
            });

            //return player;
        },
        removePlayer: function(player) {
            for(var i = 0; i < players.length; i++) {
                if(players[i] === player) {
                    //players.splice(i, 1);

                    break;
                }
            }
        },
        unitUpdate: function(data) {
            //check who can see me
            var unitUpdate = Message(data.type);
            if(data.data) {
                unitUpdate.eat(data.data);
            }
            unitUpdate.id = data.unit.id;
            unitUpdate.owner = data.unit.owner.id;
            for(var i = 0; i < players.length; i++) {
                if(players[i].canSee(data.unit)) {
                    players[i].send(unitUpdate);
                }
            }
        },
        unitReport: function(playerId) {
            var player = game.getPlayer(playerId);
            var units = player.units,
                serializedUnits = [];
            units.each(function() {
                serializedUnits.push(this.serialized);
            });
            return { "type": "unitreport" , "units": serializedUnits };
        },
        getUnit: function(player, id) {
            if(player) {
                return player.units.find("id", id);
            } else {
                var unit = null;
                for(var i = 0; i < players.length; i++) {
                    unit = players[i].units.find("id", id);
                    if(unit) {
                        return unit;
                    }
                }
            }
            //var unit = players[origin].units.find("id", id);
            //return unit;
            return null;
        },
        getClosestUnit: function(position, excludeOwner, range, spec) {
/*
            var closest = null;
            var shortest = null;
            var rangeBox = {top: -1 * range, left: -1 * range, width: range * 2 , height: range * 2 };
            for(var x = rangeBox.left; x < rangeBox.left + rangeBox.width; x++) {
                for(var y = rangeBox.top; y < rangeBox.top + rangeBox.height; y++) {
                    var unit;
                    try {
                        unit = game.collisionMap[position.X + x][position.Y + y];
                    } catch(e) {
                        unit = -1;
                    }
                    if(x > range || y > range) {
                        console.log("seeking targets beyond range! " + x + ", " + y + " out of " + range);
                    }
                    if(unit > 0) {
                        var u = game.getUnit(null, unit);
                        if(u && u.owner.id !== excludeOwner &&
                            !(spec && spec !== u.spec)) {
                            var dist = bt.Vec.distance(u.position, position);
                            if(!shortest || dist < shortest) {
                                closest = u;
                                shortest = dist;
                                if(u.position.X !== position.X + x) {
                                    console.log("targetting position mismatch: " + u.position.X + ", " + u.position.Y + " vs. " + (position.X + x) + ", " + (position.Y + y));
                                }
                            }
                        }
                    }
                }
            }*/
            var closest = null;
            for(var i = 0; i < players.length; i++) {
                if(players[i].id !== excludeOwner) {
                    var units = players[i].units;
                    units.each(function() {
                        if(bt.Vec.distance(this.position, position) < range) {
                            closest = this;
                            return true;
                        }
                    });
                }
                if(closest) break;
            }
            return closest;
        },
        unitMap: (function(){
            var unitMap = [];
            for(var x = 0; x < map.length; x++) {
                unitMap[x] = [];
            }
            return unitMap;
        }()),
        collisionMap: (function(){
            var collisionMap = [];
            for(var x = 0; x < map.length; x++) {
                collisionMap[x] = new Uint8Array(map[0].length);
                for(var y = 0; y < map[0].length; y++) {
                    if(map[x][y] === 0) {
                        collisionMap[x][y] = collision.UNPASSABLE;
                    } else {
                        collisionMap[x][y] = collision.PASSABLE;
                    }
                }
            }
            return collisionMap;
        }()),
        spiral: function(n, p, spec) {
            var x = 0,
            y = 0,
            dx = 0,
            dy = -1,
            t,
            positions = [];
            /*if(game.collisionMap[p.X][p.Y] === collision.PASSABLE && !spec) {
                positions.push({X: p.X, Y: p.Y});
            }*/

            while(positions.length < n) {
                if( (x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1-y))) {
                    t = dx;
                    dx = -dy;
                    dy = t;
                }
                if(spec) {
                    if(game.legalPosition({X: p.X + x, Y: p.Y + y}, spec)) {//game.collisionMap[p.X + x] && game.collisionMap[p.X + x][p.Y + y] === collision.PASSABLE) {
                        positions.push({X: p.X + x, Y: p.Y + y});
                    }
                } else {
                    if(game.collisionMap[p.X + x] && game.collisionMap[p.X + x][p.Y + y] === collision.PASSABLE) {
                        positions.push({X: p.X + x, Y: p.Y + y});
                    }
                }
                x += dx;
                y += dy;
            }
            return positions;
        },
        legalPosition: function(position, spec) {
            if(typeof(spec.terrain) === 'number') {
                var proximity = (game.getClosestUnit(position, null, 6, spec) !== null);

                /*units.each(function() {
                    if(this.spec == spec && bt.Vec.distance(this.tile, position) < 6) {
                        proximity = true;
                    }
                });*/
                if(proximity) return false;
                return  (map[position.X] && map[position.X][position.Y] === spec.terrain &&
                        (game.collisionMap[position.X][position.Y] === 0));
            }
            if(spec.shape) {
                var l = true;
                for(var x = 0; x < spec.shape.length; x++) {
                    for(var y = 0; y < spec.shape[0].length; y++) {
                        if(spec.shape[x][y] === 1 && game.collisionMap[position.X] && game.collisionMap[position.X + x][position.Y + y] !== collision.PASSABLE) {
                            return false;
                        }
                    }
                }
            }
            if(spec.big) {
                return (map[position.X] &&
                        map[position.X][position.Y] !== 0 &&
                        map[position.X + 1][position.Y] !== 0 &&
                        map[position.X][position.Y + 1] !== 0 &&
                        map[position.X + 1][position.Y + 1] !== 0 &&
                        game.collisionMap[position.X][position.Y] === collision.PASSABLE &&
                        game.collisionMap[position.X + 1][position.Y] === collision.PASSABLE &&
                        game.collisionMap[position.X][position.Y + 1] === collision.PASSABLE &&
                        game.collisionMap[position.X + 1][position.Y + 1] === collision.PASSABLE);
            }
            return (map[position.X] && map[position.X][position.Y] !== 0 &&
                    game.collisionMap[position.X][position.Y] === collision.PASSABLE);
        }
    };
Object.defineProperty(game, "map", {
    get: function() {
        return map;
    }
});
exports.Game = game;