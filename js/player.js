var Player = function(x, y, inputMode) {
	var ai = null,
		player = {
			local: (inputMode === Player.modes.LOCAL),
			id: game.playerCount++,
			energy: 0,
			energyMax: 0,
			unitCap: 100,
			unitQueue: 0,
			kills: 0,
			deaths: 0,
			credits: 500,
			get units() {
				return units;
			},
			unit: function(x, y, def) {
				if(units.length > player.unitCap) return;
				if(player.credits >= def.cost) {
					var u = addUnit(x, y, def);
					player.credits -= def.cost;
					return u; 
				}
				return null;
			},
			build: function(x, y, def) {
				if(units.length > player.unitCap) return;
				if(player.credits >= def.cost) {
					var u = addStructure(x, y, def);
					if(def.upkeep != null) {
						player.energy += def.upkeep;
					}
					if(def.cost != null) {
						player.credits -= def.cost;
					}
				}
				return u;
			},
			update: function() {
				if(!player.defeated) {
					if(units.length === 0) {
						player.defeated = true;
						ui.modalMessage = "☠ player " + player.id + " was defeated.";
						console.log("player " + player.id + " was defeated.");
					}
				}
				if(ai) {
					ai.update();
				}
			},
			selectTeam: function(nr) {
				game.deselectAll();
				units.each(function() {
					if(this.team === nr) {
						game.selectedUnits.add(this);
						this.select();
					}
				})
			}
		},
		units = ns.Node(),
		input = inputMode,
		name = "Player666",
		color = game.colors[player.id],
		addStructure = function(x, y, def) {
			var unit = Unit(x, y, color, def);
			if(input === 0 /* LOCAL */) {
				unit.on("click", (function(unit) {
					return function() {
						game.deselectAll();
						unit.select();
						game.selectedUnits.add(unit);
					};
				}(unit)));
			}
			unit.owner = player;
			game.units.add(unit);
			units.add(unit);
			return unit;
		},
		addUnit = function(x, y, unitdef) {
			var unit = Unit(x, y, color, unitdef || def.tank);
			if(input === 0 /* LOCAL */) {
				unit.on("click", (function(unit) {
					return function() {
						game.deselectAll();
						unit.select();
						game.selectedUnits.add(unit);
					};
				}(unit)));
			}
			unit.owner = player;
			game.units.add(unit);
			units.add(unit);
			return unit;
		};
		console.log(player.id);

    units.draw = function() {
        units.each(function() {
            this.draw();
            if(this.dead) {
				units.remove(this);
				game.units.remove(this);
			}
		});
	};

    game.root.add(units);

	//initial units.
	addStructure(x, y, def.base);
	var p1 = game.spiral(13, {X: x, Y: y});
	for( var i = 0; i < 13; i++) {
		addUnit(p1[i].X, p1[i].Y);
	}
	if(inputMode == Player.modes.AI) {
		ai = AI(player);
	}
	return player; 
};

Player.modes = {
	LOCAL: 0,
	AI: 1,
	NETWORK: 2
};