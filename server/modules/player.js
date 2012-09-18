exports.Player = function(x, y, id) {
	var ai = null,
		player = {			
			id: id,
			energy: 0,
			unitCap: 100,
			unitQueue: 0,
			kills: 0,
			deaths: 0,
			credits: 500,
			get units() {
				return units;
			},
			unit: function(x, y, def) {
				if(units.length > player.unitCap) {
					if(game.players[0] === player) {}
						//ui.alert("Unit cap reached (100)");
					return;
				}
				if(player.credits >= def.cost) {
					var u = addUnit(x, y, def);
					player.credits -= def.cost;
					return u; 
				} else {
					if(game.players[0] === player) {}
						//ui.alert("You can't afford that.");
				}
				return null;
			},
			update: function() {
				var now = (new Date()).getTime();								
				if(!player.defeated && now - game.start > 1000) {
					if(units.length === 0) {
						player.defeated = true;
						var seconds = (now - game.start) / 1000,
							playTime = (seconds / 60 | 0) + " minutes and " + (seconds % 60 | 0) + " seconds";
						//ui.modalMessage = "☠ " + name + " was defeated. Playtime: " + playTime;
						console.log("player " + player.id + " was defeated.");
					}
				}
			}
		},
		units = ns.Node(),
		name = "Network",
		color = game.colors[player.id],
		addUnit = function(x, y, unitdef) {
			var unit = Unit(x, y, color, unitdef || def.tank);
			unit.owner = player;
			game.units.add(unit);
			units.add(unit);
			return unit;
		};
		console.log(player.id);	
	var p1 = game.spiral(13, {X: x, Y: y});
	for( var i = 0; i < 13; i++) {
		addUnit(p1[i].X, p1[i].Y);
	}
	
	return player; 
};
