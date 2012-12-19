var art = {
	colorizer: Colorizer(),
	open: function (fill, stroke) {
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
	},
	body: function (angle) {
		game.context.rotate(angle);
		game.context.fillRect(-8, -16, 16, 32);
		game.context.strokeRect(-8, -16, 16, 32);
	},
	box: function(big) {
		if(big) {
			game.context.fillRect(-16, -16, 64, 64);
			game.context.strokeRect(-16, -16, 64, 64);
		} else {
			game.context.fillRect(-16, -16, 32, 32);
			game.context.strokeRect(-16, -16, 32, 32);
		}
	},
	tank: function (x, y, fill, stroke, angle, cannonAngle, notranslate) {
		var hue;
		if(!art.tank.body) { art.tank.body = {}; }
		if(!art.tank.cannon) { art.tank.cannon = {}; }
		if(!art.tank.body[fill]) {
			hue = art.colorizer.Color(fill).hue;
			art.tank.body[fill] = art.colorizer.swapHues(qdip.images.tankbody, 0, hue);
		}
		if(!art.tank.cannon[fill]) {
			hue = art.colorizer.Color(fill).hue;
			art.tank.cannon[fill] = art.colorizer.swapHues(qdip.images.cannon1, 0, hue);
		}
		game.context.save();
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.rotate(angle);
		if(stroke !== "black") {
			game.context.globalAlpha = 0.3;
			game.context.fillStyle = stroke;
			game.context.fillRect(-16, -16, 32, 32);
			game.context.globalAlpha = 1.0;
		}

		game.context.drawImage(art.tank.body[fill], 0, 0, 64, 64, -16, -16, 32, 32);
		if(cannonAngle !== 0) {
			game.context.rotate(-angle);
			game.context.rotate(cannonAngle);
		}
		game.context.drawImage(art.tank.cannon[fill], 0, 0, 64, 64, -16, -16, 32, 32);
		game.context.restore();
	},
	heavyTank: function (x, y, fill, stroke, angle, cannonAngle, notranslate) {
		art.open(fill, stroke);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		art.body(angle);
		if(cannonAngle !== 0) {
			game.context.rotate(-angle);
			game.context.rotate(cannonAngle);
		}
		game.context.fillRect(-6, -16, 4, 24);
		game.context.strokeRect(-6, -16, 4, 24);
		game.context.fillRect(-5, -5, 10, 10);
		game.context.strokeRect(-5, -5, 10, 10);

		game.context.fillRect(2, -16, 4, 24);
		game.context.strokeRect(2, -16, 4, 24);
		game.context.fillRect(-5, -5, 10, 10);
		game.context.strokeRect(-5, -5, 10, 10);

		game.context.restore();
	},
	factory: function(x, y, fill, stroke, angle, cannonAngle, notranslate) {
		var lines = [[{"X":-12,"Y":3},{"X":11,"Y":3}],[{"X":10,"Y":3},{"X":10,"Y":-1}],[{"X":10,"Y":-1},{"X":-12,"Y":-1}],[{"X":-12,"Y":-1},{"X":-12,"Y":3}],[{"X":-6,"Y":-1},{"X":-6,"Y":-5}],[{"X":-6,"Y":-5},{"X":2,"Y":-5}],[{"X":2,"Y":-5},{"X":2,"Y":-1}],[{"X":2,"Y":-4},{"X":14,"Y":-4}],[{"X":13,"Y":-3},{"X":2,"Y":-3}],[{"X":-11,"Y":2},{"X":-13,"Y":5}],[{"X":-13,"Y":5},{"X":-10,"Y":7}],[{"X":-10,"Y":7},{"X":10,"Y":7}],[{"X":10,"Y":6},{"X":12,"Y":5}],[{"X":12,"Y":5},{"X":11,"Y":3}]];
		art.open(fill, stroke);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		art.box(!notranslate);
		/*
		if(notranslate) {
			game.context.fillRect(-16, -16, 32, 32);
			game.context.strokeRect(-16, -16, 32, 32);
		} else {
			game.context.fillRect(-16, -16, 64, 64);
			game.context.strokeRect(-16, -16, 64, 64);
		}*/
		art.lines(lines);
		game.context.restore();
	},
	turret: function (x, y, fill, stroke, angle, cannonAngle, notranslate) {
		art.open(fill, stroke);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.rotate(angle);
		art.box();
		if(cannonAngle !== 0) {
			game.context.rotate(-angle);
			game.context.rotate(cannonAngle);
		}
		game.context.fillRect(-4, -20, 8, 32);
		game.context.strokeRect(-4, -20, 8, 32);
		game.context.fillRect(-10, -10, 20, 20);
		game.context.strokeRect(-10, -10, 20, 20);
		game.context.restore();
	},
	sell: function(x, y, fill, stroke, z, a, n) {
		art.open(fill, stroke);
		game.context.translate(x + tileSize / 2, y + tileSize / 2);
		art.box();
		game.context.lineWidth = 4;
		game.context.font = "20px Arial Unicode MS, Arial";
		game.context.textAlign = "center";
		game.context.fillStyle = "yellow";
		game.context.strokeText("$", 0, 6);
		game.context.fillText("$",  0, 6);
		game.context.restore();
	},
	mine: function(x, y, fill, stroke, z, a, notranslate) {

		var lines = [[{"X":-13,"Y":-13},{"X":14,"Y":-13}],[{"X":13,"Y":-13},{"X":13,"Y":15}],[{"X":13,"Y":15},{"X":7,"Y":-7}],[{"X":7,"Y":-7},{"X":-12,"Y":-13}],[{"X":6,"Y":-7},{"X":-14,"Y":12}],[{"X":-14,"Y":12},{"X":-10,"Y":15}],[{"X":-10,"Y":14},{"X":7,"Y":-6}]];
		art.open(fill, stroke);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
			if(game.buildMode && game.buildMode === def.mine) {
				game.context.globalAlpha = 0.3;
				game.context.fillRect(-1 * 32 * 5, -1 * 32 * 5, 32 * 10, 32 * 10);
				game.context.globalAlpha = 1.0;
			}
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		art.box();
		//game.context.fillRect(-16, -16, 32, 32);
		//game.context.strokeRect(-16, -16, 32, 32);
		//game.context.strokeRect(-16 - 128, -16 - 128, 256 + 32, 256 + 32);
		art.lines(lines);
		/*
		game.context.save();
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.drawImage(qdip.images.mine, 0, 0, 32, 32, -16, -16, 32, 32);*/
		game.context.restore();
	},
	hydroplant: function(x, y, fill, stroke, z, a, notranslate) {
		var lines = [[{"X":-13,"Y":0},{"X":-4,"Y":-10}],[{"X":-4,"Y":-10},{"X":2,"Y":0}],[{"X":2,"Y":0},{"X":9,"Y":-10}],[{"X":-12,"Y":7},{"X":-4,"Y":-2}],[{"X":-4,"Y":-2},{"X":2,"Y":7}],[{"X":2,"Y":7},{"X":9,"Y":-2}]];
		art.open(fill, stroke);
		//game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
			if(game.buildMode && game.buildMode === def.hydroplant) {
				game.context.globalAlpha = 0.5;
				game.context.fillRect(-1 * 32 * 5, -1 * 32 * 5, 32 * 10, 32 * 10);
				game.context.globalAlpha = 1.0;
			}
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		art.box();
		//game.context.fillRect(-16, -16, 32, 32);
		//game.context.strokeRect(-16, -16, 32, 32);
		art.lines(lines);
		game.context.restore();
	},
	powerplant: function(x, y, fill, stroke, z, a, notranslate) {
		if(!art.powerplant[fill]) {
			var hue = art.colorizer.Color(fill).hue;
			art.powerplant[fill] = art.colorizer.swapHues(qdip.images.powerplant, 0, hue);
		}
		game.context.save();
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
			game.context.drawImage(art.powerplant[fill], 0, 0, 128, 128, -16, -16, 64, 64);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
			game.context.drawImage(art.powerplant[fill], 0, 0, 128, 128, -16, -16, 32, 32);
		}
		game.context.restore();
	},
	lines: function(lines) {
		game.context.beginPath();
		for(var i = 0; i < lines.length; i++) {
			game.context.moveTo(lines[i][0].X, lines[i][0].Y);
			game.context.lineTo(lines[i][1].X, lines[i][1].Y);
		}
		game.context.stroke();
	}
};