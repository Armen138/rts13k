var Node = require('./nodes.js').Node,
    Message = require('./message.js').Message,
    Events = require('./events.js'),
    Unit = require('./unit.js').Unit;
    //def = require('./modules/definitions.js').units;
exports.Player = function(name, game, connection, id) {
    var ai = null,
        energy = 0,
        player = {
            id: id,
            //energy: 0,
            unitCap: 100,
            unitQueue: 0,
            kills: 0,
            deaths: 0,
            credits: 500,
            built: 0,
            name: name,
            get units() {
                return units;
            },
            get energy() {
                return energy;
            },
            set energy(num) {
                energy = num;
                var energyMsg = Message("energy");
                energyMsg.energy = energy;
                player.send(energyMsg);
            },
            kick: function() {
                connection.close();
            },
            unit: function(x, y, def, freebie) {
                if(units.length > player.unitCap) {
                    //if(game.players[0] === player) {}
                        //ui.alert("Unit cap reached (100)");
                        var errorMsg = Message("error");
                        errorMsg.message = "Unit cap reached";
                        player.send(errorMsg);
                    return;
                }
                if(freebie || player.credits >= def.cost) {
                    var u = addUnit(x, y, def);
                    if(!freebie) {
                        player.credits -= def.cost;
                    }
                    if(def.upkeep !== null) {
                        player.energy += def.upkeep;
                    }
                    var unitPosition = function(unit, position) {
                        var data = {
                            type: "position",
                            unit: unit,
                            data: {
                                position: unit.position,
                                path: unit.position.path
                            }
                        };
                        player.fire("unit-update", data);
                    };
                    (function(unit) {
                        unit.on("position", function(position) {
                            unitPosition(unit, position);
                        });
                        unit.on("path", function(path) {
                            var data = {
                                type: "path",
                                unit: unit,
                                data: {
                                    path: path
                                }
                            };
                            player.fire("unit-update", data);
                        });
                        unit.on("target", function(target) {
                            var data = {
                                type: "target",
                                unit: unit,
                                data: {
                                    target: target ? target.id : -1,
                                    position: target? target.position : -1
                                }
                            };
                            player.fire("unit-update", data);
                        });
                        unit.on("health", function(health) {
                            var data = {
                                type: "health",
                                unit: unit,
                                data: {
                                    health: health
                                }
                            };
                            player.fire("unit-update", data);
                        });
                        unit.on("death", function() {
                            units.remove(unit);
                            var data = {
                                type: "death",
                                unit: unit
                            };
                            player.fire("unit-update", data);
                        });
                    }(u));
                    unitPosition(u);
                    return u;
                } else {
                    var creditsErrorMsg = Message("error");
                    creditsErrorMsg.message = "You can't afford that";
                    player.send(creditsErrorMsg);
                }
                return null;
            },
            canSee: function(unit) {
                return true;
                /*
                if(player.getUnit(unit.id)) {
                    return true;
                }
                return false;*/
            },
            getUnit: function(id) {
                var ret = null;
                units.each(function() {
                    //console.log(this.id + " ? " + id);
                    if(this.id === id) {
                        ret = this;
                        //console.log("i have this unit in my inventory");
                    }
                    return true;
                });
                return ret;
            },
            die: function() {
                units.reverse(function() {
                    console.log("killed unit " + this.id);
                    this.die();
                });
                player.defeated = true;
            },
            update: function() {
                var now = (new Date()).getTime();
                if(!player.defeated && now - player.built > 0) {
                    if(units.length === 0) {
                        player.defeated = true;
                        //var seconds = (now - game.start) / 1000,
                        //  playTime = (seconds / 60 | 0) + " minutes and " + (seconds % 60 | 0) + " seconds";
                        //ui.modalMessage = "☠ " + name + " was defeated. Playtime: " + playTime;
                        console.log("player " + player.id + " was defeated.");
                        var defeatMsg = Message("defeat");
                        defeatMsg.id = player.id;
                        defeatMsg.name = player.name;
                        game.broadcast(defeatMsg);
                    }
                }
                units.each(function(){
                    this.update();
                });
            },
            send: function(data) {
                //console.log("player " + player.id + " send: " + data);
                if(typeof(data) !== "string") {
                    if(data.serialized) {
                        data = data.serialized;
                    } else {
                        data = data.toString();
                    }
                }
                game.bytecount += data.length;
                connection.sendUTF(data);
            }
        },
        units = Node(),
        addUnit = function(x, y, unitdef) {
            var unit = Unit(x, y, unitdef, game);
            unit.owner = player;
            units.add(unit);
            player.built++;
            return unit;
        };
        //console.log(player.id);
        /*
    var p1 = game.spiral(13, {X: x, Y: y});
    for( var i = 0; i < 13; i++) {
        addUnit(p1[i].X, p1[i].Y);
    }*/
    Events.attach(player);
    return player;
};
