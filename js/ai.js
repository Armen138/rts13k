var AI = function(player) {
	var ai = {
		update: function() {
			/*if(player.units) {
				player.units.each(function() {
					if(this.idle) {
						selected.add(this);
					}
				});
			}			
			if(selected.length > 0) {
				var target = {X: 10, Y: 10};
	            var p = game.map.at(target.X, target.Y),
	                destinations = game.spiral(selected.length, p);
	            selected.each(function() {
	                this.go(destinations.shift());
	            });	
	            selected.clear();			
			}*/
			if(buildorder.length > 0 && player.credits > buildorder[0].cost) {
				var structure = buildorder.shift(),
					p = game.spiral(1, base, structure);
					s = player.build(p[0].X, p[0].Y, structure);
					if(structure == def.factory) {
						factory = s;
						console.log("built factory");
					}
					s.ondeath = function(spec) {
						buildorder.push(def.powerplant);
						buildorder.push(spec);
						buildorder.push(def.turret);
					};
			}
			if(factory && buildorder.length === 0) {
				var u = null;
				if(player.credits > def.heavyTank.cost) {
					console.log("tank");
					u = player.unit(factory.tile.X, factory.tile.Y, def.heavyTank);
				} else {
					if(player.credits > def.tank.cost) {
						console.log("tank");
						u = player.unit(factory.tile.X, factory.tile.Y, def.tank);
					}	
				}
				if(u) {
					var rallyPoint = game.spiral(1, factory.rallyPoint || factory.tile)[0];
					u.go(rallyPoint, true);					
				}
			}
		}
	}, 
	base = { X: 100, Y: 100 },
	factory = null,
	selected = ns.Node(),
	buildIndex = 0,
	buildorder = [ def.powerplant, def.mine, def.powerplant, def.powerplant, def.factory, def.turret, def.turret, def.powerplant, def.mine, def.mine, def.mine, def.hydroplant ];
	return ai;
};