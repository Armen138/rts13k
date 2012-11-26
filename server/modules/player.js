var Node = require('./nodes.js').Node,
	Events = require('./events.js'),
	Unit = require('./unit.js').Unit;
	//def = require('./modules/definitions.js').units;
exports.Player = function(name, game, connection, id) {
	var ai = null,
		player = {			
			id: id,
			energy: 0,
			unitCap: 100,
			unitQueue: 0,
			kills: 0,
			deaths: 0,
			credits: 50000,
			built: 0,
			name: name,
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
					(function(unit) {
						unit.on("position", function(position) {
							var data = {
								type: "position",
								unit: unit,
								data: {
									position: position
								}
							};
							player.fire("unit-update", data);
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

					}(u));
					return u; 
				} else {
					//if(game.players[0] === player) {}
						//ui.alert("You can't afford that.");
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
					console.log(this.id + " ? " + id);
					if(this.id === id) {
						ret = this;
						console.log("i have this unit in my inventory");
					}
					return true;
				});
				return ret;
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
				units.each(function(){
					this.update();
				});
			},
			send: function(data) {
				console.log("player " + player.id + " send: " + data);
				if(typeof(data) !== "string") {
					if(data.serialized) {
						data = data.serialized;
					} else {
						data = data.toString();
					}
				}
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
		console.log(player.id);	
		/*
	var p1 = game.spiral(13, {X: x, Y: y});
	for( var i = 0; i < 13; i++) {
		addUnit(p1[i].X, p1[i].Y);
	}*/
	Events.attach(player);
	return player; 
};
