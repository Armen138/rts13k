define(["unit"], function(Unit) {
    var colors = [
            "#3A3",
            "#A3A",
            "#AA3",
            "#33A",
            "#A33",
            "#3AA"
        ];
    var Player = function(credits, id, name) {
        var player = {
                id: id,
                energy: 0,
                unitCap: 100,
                unitQueue: 0,
                name: name,
                kills: 0,
                deaths: 0,
                credits: credits,
                units: {},
                eachUnit: function(callback) {
                    for(var i = player.units.length -1; i >= 0; --i) {
                        if(callback(i)) {
                            player.units.splice(i, 1);
                        }
                    }
                },
                getUnit: function(id) {

                },
                //unit: function(x, y, def, id) {    
                unit: function(data) {
                    var unit = Unit(data.position.X, data.position.Y, color, 0, data.id);
                    unit.owner = player;                
                    player.units[data.id] = unit;  
                    return unit;
                },
                build: function(x, y, def) {
                    if(units.length >= player.unitCap) {
                        if(game.players[0] === player)
                            ui.alert("Unit cap reached (" + player.unitCap + ")");
                        return;
                    }
                    var u = addUnit(x, y, def);
                    return u;
                },
                draw: function() {
                    for(var u in player.units) {

                        player.units[u].draw();
                    }
                    // player.eachUnit(function(unit) {
                    //     unit.draw();
                    //     return unit.dead;
                    // });
                },
                selectTeam: function(nr) {
                    // game.deselectAll();
                    // var unitButtons = [];
                    // units.each(function() {
                    //     if(this.team === nr) {
                    //         game.selectedUnits.add(this);
                    //         this.select();
                    //         (function(unit) {
                    //             unitButtons.push(unit.buttons()[0]);
                    //         }(this));
                    //     }
                    // });
                    // game.hud.buttons = game.hud.SmallButtons(unitButtons);
                }
            },
            //units = [],
            //input = inputMode,
            //name = inputMode == Player.modes.AI ? "AI" : "Human",
            color = colors[player.id];
            // addUnit = function(x, y, unitdef, id) {
            //     var unit = Unit(x, y, color, unitdef || def.tank, id);
            //     if(input === 0 /* LOCAL */) {
            //         if(player.units.length === 0) {
            //             //game.centerOn({X: x, Y: y});
            //         }
            //         unit.on("click", (function(unit) {
            //             return function() {
            //                 //game.deselectAll();
            //                 //unit.select();
            //                 //game.selectedUnits.add(unit);
            //             };
            //         }(unit)));
            //     } else {
            //         unit.on("click", (function(unit){
            //             return function() {
            //                 game.selectedUnits.each(function() {
            //                     this.attack(unit);
            //                 });
            //             };
            //         }(unit)));
            //     }
            //     unit.owner = player;                
            //     player.units.add(unit);
            //     return unit;
            // };


        // units.draw = function() {
        //     var deadunits = [];
        //     units.each(function() {
        //         this.draw();
        //         if(this.dead) {
        //             deadunits.push(this);
        //         }
        //     });

        //     if(game.tacticalView && player.local) {
        //         units.each(function() {
        //             if(this.canShoot) {
        //                 var X = this.position.X - game.map.offset.X * tileSize + tileSize / 2 + gameView.offset.X,
        //                     Y = this.position.Y - game.map.offset.Y * tileSize + tileSize / 2 + gameView.offset.Y;
        //                 game.tactical.context.beginPath();
        //                 game.tactical.context.arc(X, Y, this.range * 32, 0, (Math.PI/180)*360 );
        //                 game.tactical.context.fillStyle = "red";
        //                 game.tactical.context.fill();
        //                 game.tactical.context.closePath();
        //             }
        //         });

        //         game.tactical.context.globalCompositeOperation = 'destination-out';

        //         units.each(function() {
        //             if(this.canShoot) {
        //                 var X = this.position.X - game.map.offset.X * tileSize + tileSize / 2 + gameView.offset.X,
        //                     Y = this.position.Y - game.map.offset.Y * tileSize + tileSize / 2 + gameView.offset.Y;
        //                 game.tactical.context.beginPath();
        //                 game.tactical.context.arc(X, Y, this.range * 32 - 4, 0, (Math.PI/180)*360 );
        //                 game.tactical.context.fillStyle = "red";
        //                 game.tactical.context.fill();
        //                 game.tactical.context.closePath();
        //             }
        //         });


        //     }
        //     /*for(var i = deadunits.length - 1; i >= 0; --i) {
        //         units.remove(deadunits[i]);
        //         game.units.remove(deadunits[i]);
        //     }*/
        //     for(var i = 0; i < deadunits.length; i++) {
        //         units.remove(deadunits[i]);
        //         game.units.remove(deadunits[i]);
        //     }
        // };

        //game.root.add(units);

        //initial units.
        //addStructure(x, y, def.base);

        return player;
    };

    return Player;
});