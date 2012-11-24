var procedural = require('./procedural'),
    Player = require('./player').Player,
    definitions = require('./definitions').units,
    Node = require('./nodes.js').Node,
    Message = require('./message.js').Message,
    collision = require('./collision');


var map = procedural.noiseMap(128, 128, 40, 4),
    players = {},
    units = Node(),
    game = {
        update: function() {
            for(org in players) {
                players[org].update();
            }
        },
        addPlayer: function(name, origin, connection) {
            players[origin] = Player(name, game, connection);
            players[origin].on("unit-update", game.unitUpdate);
            units.add(players[origin].unit(10, 10, definitions.tank));
            return players[origin];
        },
        unitUpdate: function(data) {
            //check who can see me
            var unitUpdate = Message(data.type);
            unitUpdate.eat(data.data);
            unitUpdate.id = data.unit.id;
            console.log("unit update: " + unitUpdate.serialized);
            //unitUpdate.unit = JSON.parse(unit.serialized); //strips needless data/functions
            for(org in players) {
                if(players[org].canSee(data.unit)) {
                    players[org].send(unitUpdate);
                }
            }
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
        },
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