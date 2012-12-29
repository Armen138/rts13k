var Player = function(x, y, inputMode, credits, id, name) {
    var ai = null,
        player = {
            local: (inputMode === Player.modes.LOCAL),
            id: id,
            energy: 0,
            energyMax: 0,
            unitCap: 100,
            unitQueue: 0,
            name: name,
            kills: 0,
            deaths: 0,
            credits: credits,
            get units() {
                return units;
            },
            unit: function(x, y, def, id) {
                /*if(units.length > player.unitCap) {
                    if(game.players[0] === player)
                        ui.alert("Unit cap reached (100)");
                    return;
                }*/
                //if(player.credits >= def.cost) {
                    var u = addUnit(x, y, def, id);
                    //player.credits -= def.cost;
                    return u;
                /*} else {
                    if(game.players[0] === player)
                        ui.alert("You can't afford that.");
                }*/
                return null;
            },
            build: function(x, y, def) {
                if(units.length > player.unitCap) {
                    if(game.players[0] === player)
                        ui.alert("Unit cap reached (100)");
                    return;
                }
                //if(player.credits >= def.cost) {
                    var u = addUnit(x, y, def);
                    /*if(def.upkeep != null) {
                        player.energy += def.upkeep;
                    }*/
                    /*if(def.cost != null) {
                        player.credits -= def.cost;
                    }*/
                //else {
                    //if(game.players[0] === player)
                    //  ui.alert("You can't afford that.");
                //}
                return u;
            },
            update: function() {
                var now = (new Date()).getTime();
                //if(!player.defeated && now - game.start > 1000) {
                    /*if(units.length === 0) {
                        player.defeated = true;
                        var seconds = (now - game.start) / 1000,
                            playTime = (seconds / 60 | 0) + " minutes and " + (seconds % 60 | 0) + " seconds";
                        ui.modalMessage = "☠ " + name + " was defeated. Playtime: " + playTime;
                        console.log("player " + player.id + " was defeated.");
                    }*/
                //}
            },
            selectTeam: function(nr) {
                game.deselectAll();
                var unitButtons = [];
                units.each(function() {
                    if(this.team === nr) {
                        game.selectedUnits.add(this);
                        this.select();
                        (function(unit) {
                            unitButtons.push(unit.buttons()[0]);
                        }(this));
                    }
                });
                game.hud.buttons = game.hud.SmallButtons(unitButtons);
            }
        },
        units = ns.Node(),
        input = inputMode,
        name = inputMode == Player.modes.AI ? "AI" : "Human",
        color = game.colors[player.id],
        addUnit = function(x, y, unitdef, id) {
            var unit = Unit(x, y, color, unitdef || def.tank, id);
            if(input === 0 /* LOCAL */) {
                if(player.units.length === 0) {
                    game.centerOn({X: x, Y: y});
                }
                unit.on("click", (function(unit) {
                    return function() {
                        game.deselectAll();
                        unit.select();
                        game.selectedUnits.add(unit);
                    };
                }(unit)));
            } else {
                unit.on("click", (function(unit){
                    return function() {
                        game.selectedUnits.each(function() {
                            this.attack(unit);
                        });
                    }
                }(unit)));
            }
            unit.owner = player;
            game.units.add(unit);
            units.add(unit);
            return unit;
        };
        console.log(player.id);

    units.draw = function() {
        var deadunits = [];
        units.each(function() {
            this.draw();
            if(this.dead) {
                deadunits.push(this);
            }
        });

        if(game.tacticalView && player.local) {
            units.each(function() {
                if(this.canShoot) {
                    var X = this.position.X - game.map.offset.X * tileSize + tileSize / 2 + gameView.offset.X,
                        Y = this.position.Y - game.map.offset.Y * tileSize + tileSize / 2 + gameView.offset.Y;
                    game.tactical.context.beginPath();
                    game.tactical.context.arc(X, Y, this.range * 32, 0, (Math.PI/180)*360 );
                    game.tactical.context.fillStyle = "red";
                    game.tactical.context.fill();
                    game.tactical.context.closePath();
                }
            });

            game.tactical.context.globalCompositeOperation = 'destination-out';

            units.each(function() {
                if(this.canShoot) {
                    var X = this.position.X - game.map.offset.X * tileSize + tileSize / 2 + gameView.offset.X,
                        Y = this.position.Y - game.map.offset.Y * tileSize + tileSize / 2 + gameView.offset.Y;
                    game.tactical.context.beginPath();
                    game.tactical.context.arc(X, Y, this.range * 32 - 4, 0, (Math.PI/180)*360 );
                    game.tactical.context.fillStyle = "red";
                    game.tactical.context.fill();
                    game.tactical.context.closePath();
                }
            });


        }
        /*for(var i = deadunits.length - 1; i >= 0; --i) {
            units.remove(deadunits[i]);
            game.units.remove(deadunits[i]);
        }*/
        for(var i = 0; i < deadunits.length; i++) {
            units.remove(deadunits[i]);
            game.units.remove(deadunits[i]);
        }
    };

    game.root.add(units);

    //initial units.
    //addStructure(x, y, def.base);

    if(inputMode == Player.modes.AI) {
        ai = AI(player);
    } else {
        /*var p1 = game.spiral(13, {X: x, Y: y});
        for( var i = 0; i < 13; i++) {
            addUnit(p1[i].X, p1[i].Y);
        }*/
    }
    return player;
};

Player.modes = {
    LOCAL: 0,
    AI: 1,
    NETWORK: 2
};