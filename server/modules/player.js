var Node = require('./nodes.js').Node,
	Unit = require('./unit.js').Unit,
	playerCount = 0;
	//def = require('./modules/definitions.js').units;
exports.Player = function(name) {
	var ai = null,
		player = {			
			id: playerCount++,
			energy: 0,
			unitCap: 100,
			unitQueue: 0,
			kills: 0,
			deaths: 0,
			credits: 500,
			built: 0,
			get units() {
				return units;
			},
			unit: function(x, y, def) {
				if(units.length > player.unitCap) {
					//if(game.players[0] === player) {}
						//ui.alert("Unit cap reached (100)");
					return;
				}
				if(player.credits >= def.cost) {
					var u = addUnit(x, y, def);
					player.credits -= def.cost;
					return u; 
				} else {
					//if(game.players[0] === player) {}
						//ui.alert("You can't afford that.");
				}
				return null;
			},
			update: function() {
				var now = (new Date()).getTime();								
				if(!player.defeated && now - player.built > 0) {
					if(units.length === 0) {
						player.defeated = true;
						//var seconds = (now - game.start) / 1000,
						//	playTime = (seconds / 60 | 0) + " minutes and " + (seconds % 60 | 0) + " seconds";
						//ui.modalMessage = "☠ " + name + " was defeated. Playtime: " + playTime;
						console.log("player " + player.id + " was defeated.");
					}
				}
			}
		},
		units = Node(),
		addUnit = function(x, y, unitdef) {
			var unit = Unit(x, y, unitdef);
			unit.owner = player;			
			units.add(unit);
			player.built++;
			return unit;
		};
		console.log(player.id);	
		/*
	var p1 = game.spiral(13, {X: x, Y: y});
	for( var i = 0; i < 13; i++) {
		addUnit(p1[i].X, p1[i].Y);
	}*/
	
	return player; 
};
