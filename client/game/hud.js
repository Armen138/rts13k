(function() {
	var context,
		margin = 10,
		mapOverlay = (function(){
			var canvas = document.createElement('canvas');
			canvas.width = 128;
			canvas.height = 128;
			return {canvas: canvas, context: canvas.getContext('2d') };
		}());
	function Minimap(x, y, w, h) {
		var image = null;
		return {
			draw: function() {
				if(!image) {
					image = game.map.drawMini();
				}
				context.drawImage(image, x, y);
				mapOverlay.context.clearRect(0, 0, w, h);
				game.units.each(function() {
					if(this.owner === game.players[0]) {
						mapOverlay.context.fillStyle = "#7eff15";
						mapOverlay.context.fillRect(this.tile.X, this.tile.Y, 2, 2);
					} else {
						mapOverlay.context.fillStyle = "red";
						mapOverlay.context.fillRect(this.tile.X, this.tile.Y, 2, 2);
					}
				});
				mapOverlay.context.strokeRect(game.map.offset.X, game.map.offset.Y, (game.canvas.width / tileSize), (game.canvas.height / tileSize));
				context.drawImage(mapOverlay.canvas, 0, 0, game.map.width, game.map.height, x, y, w, h);
			},
			inside: function(pos){
				if (pos.X > x &&
					pos.X < x + w &&
					pos.Y > y &&
					pos.Y < y + h) {
					return {X: (pos.X - x), Y: (pos.Y - y)};
				}
				return -1;
			}
		};
	}

	function ButtonSlots(numButtons) {
		var top = margin + 128 + margin + 32 + margin;
		return {
			draw: function() {
				context.save();
				context.fillStyle = "black";
				for(var i = 0; i < numButtons; i++) {
					var x = margin + 69 * (i % 2),
						y = top + 69 * (i / 2 | 0);
					context.fillRect(x, y, 59, 59);
				}
				context.restore();
			},
			inside: function(pos) {
				for(var i = 0; i < numButtons; i++) {
					var x = margin + 69 * (i % 2),
						y = top + 69 * (i / 2 | 0);
					if (pos.X > x &&
						pos.X < x + 59 &&
						pos.Y > y &&
						pos.Y < y + 59) {
						return i;
					}
				}
				return -1;
			}
		};
	}

	function Buttons(buttons) {
		var top = margin + 128 + margin + 32 + margin;
		var toolTipLeft = 150;
		var toolTipSize = {W: 160, H: 50};
		var b = {
			draw: function() {
				context.save();
				for(var i = 0; i < buttons.length; i++) {
					var x = margin + 69 * (i % 2),
						y = top + 69 * (i / 2 | 0);
					context.drawImage(qdip.images.button64, x, y, 64, 64);
					if(typeof(buttons[i].image) === "function") {
						buttons[i].image(x, y, "gray", "black", 0, 0, true, 48);
					} else {
						context.drawImage(buttons[i].image, x, y, 48, 48);
					}
					if(buttons[i].badge) {
						context.fillStyle = "black";
						context.font = "12px Arial";
						context.fillText(buttons[i].badge, x, y);
					}
				}
				var button = b.at(game.mousePosition);
				if(button !== -1 && buttons[button].tooltip) {
					toolTipSize.H = buttons[button].tooltip.length * 20 + 8;
					context.fillStyle = "gray";
					context.fillRect(toolTipLeft, game.mousePosition.Y, toolTipSize.W, toolTipSize.H);
	//				context.fillStyle = "black";
					context.fillStyle = "yellow";
					context.font = "20px Arial";

					context.shadowColor = "black";
					context.shadowOffsetX = 0;
					context.shadowOffsetY = 0;
					context.shadowBlur = 4;

					context.textAlign ="left";
					context.textBaseline = "hanging";

					for(var t = 0; t < buttons[button].tooltip.length; t++) {
						context.fillText(buttons[button].tooltip[t], toolTipLeft + 4, game.mousePosition.Y + 4 + t * 20);
					}
				}
				context.restore();
			},
			at: function(pos) {
				//if(x < 148) {
					for(var i = 0; i < buttons.length; i++) {
						var x = margin + 69 * (i % 2),
							y = top + 69 * (i / 2 | 0);
						if (pos.X > x &&
							pos.X < x + 59 &&
							pos.Y > y &&
							pos.Y < y + 59) {
							return i;
						}
					}
				//}
				return -1;
			},
			click: function(pos) {
				/*for(var i = 0; i < buttons.length; i++) {
					var x = margin + 69 * (i % 2),
						y = top + 69 * (i / 2 | 0);
					if (pos.X > x &&
						pos.X < x + 59 &&
						pos.Y > y &&
						pos.Y < y + 59) {
						buttons[i].action();
						return true;
					}
				}*/
				var i = b.at(pos);
				if(i !== -1) {
					buttons[i].action();
					return true;
				}
				return false;
			}
		};
		return b;
	}

	function SmallButtons(buttons) {
		var buttonSize = 32,
			buttonMargin = 16,
			top = margin + 128 + margin + 32 + margin;
		return {
			draw: function() {
				context.save();
				for(var i = 0; i < buttons.length; i++) {
					//var x = margin + 69 * (i % 2),
					var x = margin + (i % 3) * (buttonSize + buttonMargin),//(margin + i * buttonSize + i * buttonMargin),
						y = top + 48 * (i / 3 | 0);
					context.drawImage(qdip.images.button64, x - 4, y - 4, 40, 40);
					if(typeof(buttons[i].image) === "function") {
						buttons[i].image(x - 16, y - 16);//, "gray", "black", 0, 0, true);
					} else {
						context.drawImage(buttons[i].image, x, y, 32, 32);
					}
					if(buttons[i].badge) {
						context.fillStyle = "black";
						context.font = "12px Arial";
						context.fillText(buttons[i].badge, x, y);
					}
				}
				context.restore();
			},
			click: function(pos) {
				for(var i = 0; i < buttons.length; i++) {
					var x = margin + (i % 3) * (buttonSize + buttonMargin),
						y = top + 48 * (i / 3 | 0);
					if (pos.X > x &&
						pos.X < x + buttonSize &&
						pos.Y > y &&
						pos.Y < y + buttonSize) {
						buttons[i].action();
						return true;
					}
				}
				return false;
			}
		};
	}

	function MiniButtonSlots(numButtons) {
		var buttonSize = 32,
			buttonMargin = 16,
			top = 128 + margin * 2;
		return {
			draw: function() {
				context.save();
				context.fillStyle = "black";
				for(var i = 0; i < numButtons; i++) {
					var x = margin + i * buttonSize + i * buttonMargin;
					context.fillRect(x, top, buttonSize, buttonSize);
				}
				context.restore();
			},
			inside: function(pos) {
				for(var i = 0; i < numButtons; i++) {
					var x = margin + i * buttonSize + i * buttonMargin;

					if(pos.X > x &&
						pos.X < x + buttonSize &&
						pos.Y > top &&
						pos.Y < top + buttonSize) {
						return i;
					}
				}
				return -1;
			}
		};
	}

	function Stats(x, y) {
		var sideMargins = 160;
		var width = window.innerWidth;
		return {
			draw: function() {
				var player = game.players[0];
				context.save();
				context.fillStyle = "yellow";
				context.font = "20px Arial";

				context.shadowColor = "black";
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 4;

				context.textAlign ="center";
				context.textBaseline = "hanging";
				context.fillText("energy: " + player.energy, sideMargins + (width - sideMargins * 2) / 6, y);
				context.fillText("credits: " + player.credits, width - sideMargins - (width - sideMargins * 2) / 6, y);
				context.fillText("units: " + player.units.length + "/200", width / 2, y);
				context.restore();
			}
		};
	}

	function bg() {
		context.save();
		//context.fillStyle = "#815f4b";
		context.fillStyle = "gray";
		context.fillRect(0, 0, 148, window.innerHeight);
		//context.drawImage(qdip.images.hudborder, 0, 0);
		//context.drawImage(qdip.images.hud, 0, 0);
		context.restore();
	}

	window.Hud = function(ctx) {
		context = ctx;
		var minimap = Minimap(margin, margin, 128, 128),
			buttonSlots = ButtonSlots(9),
			miniButtonSlots = MiniButtonSlots(3),
			stats = Stats(160, margin);
			events = {};
		var hud = {
			buttons: null,
			draw: function() {
				bg();
				minimap.draw();
				miniButtonSlots.draw();
				//buttonSlots.draw();
				if(hud.buttons) {
					hud.buttons.draw();
				}
				stats.draw();
			},
			inside: function(pos) {
				return (pos.X < 148);
			},
			on: function(evt, cb) {
				if(!events[evt]) {
					events[evt] = [];
				}
				events[evt].push(cb);
			},
			fire: function(evt, obj) {
				if(!events[evt]) return;
				for(var i = 0; i < events[evt].length; i++) {
					events[evt][i](obj);
				}
			},
			Buttons: Buttons,
			SmallButtons: SmallButtons
		};
		document.addEventListener("click", function(e) {
			var pos = { X: e.clientX, Y: e.clientY };
			if(hud.inside(pos)) {
				var p = minimap.inside(pos);
				if(p !== -1) {
					hud.fire("minimap", p);
				}
				var b = buttonSlots.inside(pos);
				if(b !== -1) {
					hud.fire("button", b);
				}
				b = miniButtonSlots.inside(pos);
				if(b !== -1) {
					hud.fire("minibutton", b);
				}
				if(hud.buttons) {
					hud.buttons.click(pos);
				}
			}
		});
		return hud;
	};
}());