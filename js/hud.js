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
				mapOverlay.context.strokeRect(game.map.offset.X, game.map.offset.Y, game.canvas.width / tileSize, game.canvas.height / tileSize);
				context.drawImage(mapOverlay.canvas, x, y);
			},
			inside: function(pos){
				if (pos.X > x &&
					pos.X < x + w &&
					pos.Y > y &&
					pos.Y < y + h) {
					return {X: pos.X - x, Y: pos.Y - y};
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
		return {
			draw: function() {
				context.save();
				for(var i = 0; i < buttons.length; i++) {
					var x = margin + 69 * (i % 2),
						y = top + 69 * (i / 2 | 0);
					//context.fillRect(x, y, 59, 59);
					context.drawImage(buttons[i].image, x, y, 59, 59);
				}
				context.restore();
			},
			click: function(pos) {
				for(var i = 0; i < buttons.length; i++) {
					var x = margin + 69 * (i % 2),
						y = top + 69 * (i / 2 | 0);
					if (pos.X > x &&
						pos.X < x + 59 &&
						pos.Y > y &&
						pos.Y < y + 59) {
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
				context.save();
				context.fillStyle = "black";
				context.font = "14px Arial";
				context.textAlign ="center";
				context.textBaseline = "hanging";
				context.fillText("energy: 100", sideMargins + (width - sideMargins * 2) / 6, y);
				context.fillText("credits: 99", width - sideMargins - (width - sideMargins * 2) / 6, y);
				context.fillText("units: 101/200", width / 2, y);
				context.restore();
			}
		};
	}

	function bg() {
		context.save();
		context.fillStyle = "gray";
		context.fillRect(0, 0, 148, window.innerHeight);
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
			Buttons: Buttons
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