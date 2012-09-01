var ui = {
	topline: 30,
	minimapImage: null,
	hudPosition: {X: 10, Y: 10},
	hudSize: {W: 512, H: 160},
	alpha: 1.0,
	actionButtons: [],
	buildables: [ def.mine, def.powerplant, def.hydroplant, def.turret, def.factory ],
	unitBuildables: [def.tank, def.heavyTank],
	modalMessage: "",
	minimapUnits: (function(){
		var canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		return {canvas: canvas, context: canvas.getContext('2d') };
	}()),
	has: function(x, y) {
		return (x > ui.hudPosition.X && x < ui.hudPosition.X + ui.hudSize.W &&
				y > ui.hudPosition.Y && y < ui.hudPosition.Y + ui.hudSize.H);
	},
	modal: function() {
		game.context.save();
		game.context.fillStyle = "rgba(0, 0, 0, 0.5)";
		game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
		game.context.strokeStyle = "yellow";
		game.context.fillStyle = "black";
		game.context.font = "50px Arial Unicode MS, Arial";
		game.context.textAlign = "center";
		game.context.strokeText(ui.modalMessage ,  game.canvas.width / 2, game.canvas.height / 2);
		game.context.fillText(ui.modalMessage ,  game.canvas.width / 2, game.canvas.height / 2);
		game.context.restore();
	},
	draw: function() {
		ui.hud();
		ui.stats();
		ui.minimap();
		if(game.selectedUnits.length === 1 && game.selectedUnits.get(0).factory) {
			ui.factory(game.selectedUnits.get(0));
		} else {
			if(game.selectedUnits.length > 0) {
				ui.selection();
			} else {
				ui.factory();
			}			
		}
		if(ui.modalMessage !== "") {
			ui.modal();
		}
	},
	factory: function(units) {		
		var actionArea = { X: 100, Y: 16 },
			color = "grey",
			buildables = units ? ui.unitBuildables : ui.buildables;
		ui.actionButtons = [];
		game.context.save();
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);
		game.context.globalAlpha = ui.alpha;		
		for(var i = 0; i < buildables.length; i++) {
			color = buildables[i].cost < game.players[0].credits ? "grey" : "red";
			buildables[i].art(actionArea.X + i * 40, actionArea.Y, color, "black", 0, 0, true);
			(function(buildable) {
				ui.actionButtons.push(function() { 
					if(units) {
						var u = game.players[0].unit(units.tile.X, units.tile.Y, buildable);
						if(u) {
							var rallyPoint = game.spiral(1, units.rallyPoint || units.tile)[0];
							u.go(rallyPoint, true);
						}
					} else {
						game.buildMode = buildable;
					}
				});
			}(buildables[i]));
		}
		game.context.restore();
	},
	stats: function() {
		var player = game.players[0];
		game.context.save();
		game.context.globalAlpha = ui.alpha;
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);
		game.context.lineWidth = 4;
		game.context.fillStyle = "yellow";
		game.context.strokeStyle = "black";
		game.context.font = "30px Arial Unicode MS, Arial";
		game.context.strokeText("⚡", 20, ui.topline);
		game.context.fillText("⚡",  20, ui.topline);
				
		game.context.strokeText("$", 20, ui.topline + 40);
		game.context.fillText("$",  20, ui.topline + 40);

		game.context.font = "20px Arial Unicode MS, Arial";
		game.context.strokeText("⚔", 20, ui.topline + 80);
		game.context.fillText("⚔",  20, ui.topline + 80);


		game.context.fillStyle = "black";
		game.context.font = "16px Arial Unicode MS, Arial";
		game.context.fillText(player.energy, 50, ui.topline);
		game.context.fillText(player.credits, 50, ui.topline + 40);
		game.context.fillText(player.kills + "/" + player.deaths, 50, ui.topline + 80);

		game.context.restore();
	},
	hud: function() {
		game.context.save();
		game.context.globalAlpha = ui.alpha;
		game.context.fillStyle = "grey";
		game.context.strokeStyle = "black";
		game.context.lineWidth = 4;
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);
		game.context.fillRect(0, 0, ui.hudSize.W, ui.hudSize.H);
		game.context.strokeRect(0, 0, ui.hudSize.W, ui.hudSize.H);
		game.context.restore();
	},
	minimap: function() {
		if(!ui.minimapImage) {
			ui.minimapImage = game.map.drawMini();
		}
		ui.minimapUnits.context.clearRect(0, 0, 128, 128);
		game.units.each(function() {
			if(this.owner === game.players[0]) {
				ui.minimapUnits.context.fillStyle = "#7eff15";
				ui.minimapUnits.context.fillRect(this.tile.X, this.tile.Y, 2, 2);
			}
		});
		game.context.save();
		ui.minimapUnits.context.strokeRect(game.map.offset.X, game.map.offset.Y, game.canvas.width / tileSize, game.canvas.height / tileSize);
		game.context.globalAlpha = 0.5 * ui.alpha;
		game.context.drawImage(ui.minimapImage, ui.hudPosition.X + 368, ui.hudPosition.Y + 16);
		game.context.globalAlpha = ui.alpha;
		game.context.drawImage(ui.minimapUnits.canvas, ui.hudPosition.X + 368, ui.hudPosition.Y + 16);
		game.context.restore();
	},
	selection: function() {
		ui.actionButtons = [];
		game.context.save();
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);
		game.context.globalAlpha = ui.alpha;
		var x = 0, y = 0;
		var c = bt.Color("#0F0");
		var max = 18;
		var count = 0;
		game.selectedUnits.each(function() {
			if(!this.dead && count < max) {
				(function(unit) {
					ui.actionButtons.push(function() {				
						game.deselectAll();
						game.selectedUnits.add(unit);
						unit.select();						
					});
				}(this));
				c.red = (1.0 - this.percent) * 255 | 0;
				c.green = (this.percent) * 255 | 0;
				this.art(100 + x, 16 + y, c.toString(), "black", 0, 0, true);
				x+= 40;
				if(x > 225) {
					x = 0; y+= 40;
				}
				count++;
			}
		});
		c.release();
		game.context.restore();
	},
	click: function(x, y) {
		console.log({X: x, Y: y});
		var minimap = {X: x - 368, Y: y - 16},
			screenTiles = { X: game.canvas.width / tileSize | 0, Y: game.canvas.height / tileSize | 0 },
			actionArea = {X: x - 100, Y: y - 16};

		if(minimap.X > 0 && minimap.X < 128 && minimap.Y > 0 && minimap.Y < 128) {
			game.map.offset.X = minimap.X & (127 - screenTiles.X) | 0;
			game.map.offset.Y = minimap.Y & (127 - screenTiles.Y) | 0;
			console.log(game.map.offset);
			game.map.draw();
		}

		if(actionArea.X > 0 && actionArea.X < 240 && actionArea.Y > 0 && actionArea.Y < 120) {
			var button = (actionArea.X / 40 | 0) + (actionArea.Y / 40 | 0) * 6;
			if(ui.actionButtons.length > button) {
				ui.actionButtons[button]();
			}
		}
	}
};