Player = function(x, y, inputMode) {
	var player = {
			local: (inputMode === Player.modes.LOCAL),
			id: game.playerCount++,
			update: function() {
				if(!player.defeated) {
					if(units.length === 0) {
						player.defeated = true;
						console.log("player " + player.id + " was defeated.");
					}
				}
			}
		},
		units = ns.Node(),
		input = inputMode,
		name = "Player666",
		color = game.colors[player.id],
		addUnit = function(x, y) {
		    var unit = Unit(x, y, color);
		    if(input === 0 /* LOCAL */) {
			    unit.on("click", (function(unit) {
			        return function() {
			            game.deselectAll();
			            unit.select();
			            game.selectedUnits.add(unit);
			        }
			    }(unit)));
			}
			unit.owner = player;
			game.units.add(unit);
			units.add(unit);
		};
		console.log(player.id);

    units.draw = function() {
        units.each(function() {
            this.draw();
            if(this.dead) {
            	units.remove(this);
            	game.units.remove(this);
            	console.log("unit died");
            }
        });
    }		

    game.root.add(units);

	//initial units.
	var p1 = game.spiral(13, {X: x, Y: y});
	for( var i = 0; i < 13; i++) {
		addUnit(p1[i].X, p1[i].Y);
	}
	return player; 
}

Player.modes = {
	LOCAL: 0,
	AI: 1,
	NETWORK: 2
};