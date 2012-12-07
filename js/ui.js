var ui = {
	topline: 30,
	minimapImage: null,
	hudPosition: {X: 10, Y: 10},
	hudSize: {W: 512, H: 160},
	alpha: 1.0,
	actionButtons: [],
	tooltips: [],
	buildables: [ def.mine, def.powerplant, def.turret, def.factory ],
	unitBuildables: [def.tank, def.heavyTank],
	modalMessage: "",
	alertMessage: {time: 0, text: ""},
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
	alert: function(msg) {
		ui.alertMessage = { time: (new Date()).getTime(), text: "⚠ " + msg };
	},
	drawAlert: function() {
		var now = (new Date()).getTime();
		if(now - ui.alertMessage.time > 2000) {
			ui.alertMessage.time = 0;
			return;
		} 
		game.context.save();
		game.context.strokeStyle = "yellow";
		game.context.fillStyle = "black";
		game.context.font = "24px Dejavu Sans, Arial";
		game.context.textAlign = "center";
		game.context.strokeText(ui.alertMessage.text ,  game.canvas.width / 2, 50);
		game.context.fillText(ui.alertMessage.text ,  game.canvas.width / 2, 50);
		game.context.restore();
	},
	modal: function() {
		game.context.save();
		game.context.fillStyle = "rgba(0, 0, 0, 0.5)";
		game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
		game.context.strokeStyle = "yellow";
		game.context.fillStyle = "black";
		game.context.font = "24px Dejavu Sans, Arial";
		game.context.textAlign = "center";
		game.context.strokeText(ui.modalMessage ,  game.canvas.width / 2, game.canvas.height / 2);
		game.context.fillText(ui.modalMessage ,  game.canvas.width / 2, game.canvas.height / 2);
		game.context.restore();
	},
	box: function(x, y, w, h) {
		game.context.fillStyle = "rgba(0, 255, 0, 0.5)";
		game.context.strokeStyle = "black";
		game.context.fillRect(x, y, w, h);
		game.context.strokeRect(x, y, w, h);		
	},
	label: function(text, x, y) {
		game.context.font = "10px Dejavu Sans, Arial";
		game.context.textAlign = "left";
		game.context.fillStyle = "black";		
		game.context.fillText(text ,  x, y);	
	},
	draw: function() {
		//ui.leftHud();
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
		if(ui.alertMessage.time > 0) {
			ui.drawAlert();
		}	
		var button = ui.buttonAt(game.mousePosition.X - ui.hudPosition.X, game.mousePosition.Y - ui.hudPosition.Y);
		if(button !== -1 && button < ui.actionButtons.length && button < ui.tooltips.length) {
			var text = ui.tooltips[button].split(",");
			ui.box(game.mousePosition.X, game.mousePosition.Y - 15, 80, 30);
			for(var i = 0; i < text.length; i++) {
				ui.label(text[i], game.mousePosition.X + 10, game.mousePosition.Y + i * 12);	
			}			
		}
	},
	factory: function(units) {		
		var actionArea = { X: 100, Y: 16 },
			color = "grey",
			buildables = units ? ui.unitBuildables : ui.buildables;
		ui.actionButtons = [];
		ui.tooltips = [];
		game.context.save();
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);
		game.context.globalAlpha = ui.alpha;		
		for(var i = 0; i < buildables.length; i++) {
			color = buildables[i].cost < game.players[0].credits ? "grey" : "red";
			buildables[i].art(actionArea.X + i * 40, actionArea.Y, color, "black", 0, 0, true);			
			ui.label("$" + buildables[i].cost, actionArea.X + i * 40, actionArea.Y);
			(function(buildable) {
				var tt = buildable.name;
				if(buildable.upkeep) {
					tt += ",⚡" + buildable.upkeep;
				}
				ui.tooltips.push(tt);
				ui.actionButtons.push(function() { 
					if(units) {
						var p = game.spiral(1, units.tile)[0];
						//var u = game.players[0].unit(p.X, p.Y, buildable);
						//if(u) {
							var rallyPoint = game.spiral(1, units.rallyPoint || units.tile)[0];
						//	u.go(rallyPoint, false);
						//}
						network.build(p, buildable, rallyPoint);
					} else {
						game.buildMode = buildable;
					}
				});
			}(buildables[i]));
		}	
		if(units) {
			var b = units;
			ui.tooltips.push(b.name + ",Sell for $" + (b.spec.cost / 2));
			ui.actionButtons.push(function() {
				game.deselectAll();
				game.sell(b);
			});
			art.sell(100 + buildables.length * 40, 16, "green", "black", 0, 0, true);			
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
		game.context.font = "30px Dejavu Sans, Arial"
;		game.context.strokeText("⚡", 20, ui.topline);
		game.context.fillText("⚡",  20, ui.topline);
				
		game.context.strokeText("$", 20, ui.topline + 40);
		game.context.fillText("$",  20, ui.topline + 40);

		game.context.font = "20px Dejavu Sans, Arial";
		game.context.strokeText("⚔", 20, ui.topline + 80);
		game.context.fillText("⚔",  20, ui.topline + 80);


		game.context.fillStyle = "black";
		game.context.font = "16px Dejavu Sans, Arial";
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
	leftHud: function() {
		game.context.save();
		game.context.globalAlpha = ui.alpha;
		game.context.fillStyle = "grey";
		game.context.strokeStyle = "black";
		game.context.lineWidth = 4;
		game.context.translate(0, 0);
		game.context.fillRect(0, 0, 200, 200);
		//game.context.strokeRect(0, 0, ui.hudSize.W, ui.hudSize.H);
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
			} else {
				ui.minimapUnits.context.fillStyle = "#ff7e15";
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
		ui.tooltips = [];
		game.selectedUnits.each(function() {
			if(!this.dead && count < max) {
				(function(unit) {
					ui.tooltips.push(unit.health + "hp");
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
		if(game.selectedUnits.length === 1 && !game.selectedUnits.get(0).mobile) {
			var b = game.selectedUnits.get(0);
			ui.tooltips.push(b.name + ",Sell for $" + (b.spec.cost / 2));
			ui.actionButtons.push(function() {
				game.deselectAll();
				game.sell(b);
			});
			art.sell(100 + 40, 16, "green", "black", 0, 0, true);
		}
		c.release();
		game.context.restore();
	},
	buttonAt: function(x, y) {
		var actionArea = {X: x - 100, Y: y - 16};
		if(actionArea.X > 0 && actionArea.X < 240 && actionArea.Y > 0 && actionArea.Y < 120) {
			var button = (actionArea.X / 40 | 0) + (actionArea.Y / 40 | 0) * 6;
			if(ui.actionButtons.length > button) {
				return button;
			}
		}
		return -1;
	},
	click: function(x, y) {		
		var minimap = {X: x - 368, Y: y - 16},
			screenTiles = { X: game.canvas.width / tileSize | 0, Y: game.canvas.height / tileSize | 0 },
			actionArea = {X: x - 100, Y: y - 16};
		if(minimap.X > 0 && minimap.X < 128 && minimap.Y > 0 && minimap.Y < 128) {
			game.map.offset.X = minimap.X & (127 - screenTiles.X) | 0;
			game.map.offset.Y = minimap.Y & (127 - screenTiles.Y) | 0;		
			game.map.draw();
		}
		var button = ui.buttonAt(x, y);
		if(button !== -1) {
			ui.actionButtons[button]();	
		}
	}
};