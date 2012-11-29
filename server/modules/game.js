var procedural = require('./procedural'),
    Player = require('./player').Player,
    definitions = require('./definitions').units,
    Node = require('./nodes.js').Node,
    Message = require('./message.js').Message,
    collision = require('./collision');


var map = procedural.noiseMap(128, 128, 40, 4),
    players = [],
    units = Node(),
    game = {
        get players(){
            return players;
        },
        update: function() {
            for(var i = 0; i < players.length; i++) {
                players[i].update();
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
                serializedPlayers.push({
                    "name" : players[i].name,
                    "id": players[i].id
                });
            }
            return serializedPlayers;
        },
        addPlayer: function(name, connection) {
            var player = Player(name, game, connection, players.length);
            players.push(player);
            player.on("unit-update", game.unitUpdate);
            var p1 = game.spiral(13, {X: 10, Y: 10});

            for( var i = 0; i < 13; i++) {
                //addUnit(p1[i].X, p1[i].Y);
                units.add(player.unit(p1[i].X, p1[i].Y, definitions.tank, true));
            }            
            //units.add(players[origin].unit(10, 10, definitions.tank));
            return player;
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
        getClosestUnit: function(position, excludeOwner, range) {
            var level = range;
            //for(var level = 1; level < range; level++) {
                rangeBox = {top: -1 * level, left: -1 * level, right: level , bottom: level };
                for(var x = rangeBox.left; x < rangeBox.right; x++) {
                    for(var y = rangeBox.top; y < rangeBox.bottom; y++) {
                        var unit;
                        try {
                            unit = game.collisionMap[position.X + x][position.Y + y];
                        } catch(e) {
                            unit = null;
                        }
                        
                        if(unit > 0) {
                            var u = game.getUnit(null, unit);
                            if(u && u.owner.id !== excludeOwner) {
                                //console.log(u.position);
                                return u;                                
                            }
                        }
                    }
                }
            //}
            return null;
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
                var proximity = false;
                units.each(function() {
                    if(this.spec == spec && Vec.distance(this.tile, position) < 6) {
                        proximity = true;
                    }
                });
                if(proximity) return false;
                return  (map[position.X] && map[position.X][position.Y] === spec.terrain &&
                        (game.collisionMap[position.X][position.Y] !== collision.UNIT || collision.STRUCTURE));
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