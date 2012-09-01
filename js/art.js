var art = {
	tank: function (x, y, fill, stroke, angle, cannonAngle, notranslate) {
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.rotate(angle);
		game.context.fillRect(-8, -16, 16, 32);
		game.context.strokeRect(-8, -16, 16, 32);
		if(cannonAngle !== 0) {
			game.context.rotate(-angle);
			game.context.rotate(cannonAngle);
		}
		game.context.fillRect(-2, -16, 4, 24);
		game.context.strokeRect(-2, -16, 4, 24);
		game.context.fillRect(-5, -5, 10, 10);
		game.context.strokeRect(-5, -5, 10, 10);
		game.context.restore();
	},
	heavyTank: function (x, y, fill, stroke, angle, cannonAngle, notranslate) {
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.rotate(angle);
		game.context.fillRect(-8, -16, 16, 32);
		game.context.strokeRect(-8, -16, 16, 32);
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
	base: function(x, y, fill, stroke, angle, cannonAngle, notranslate) {
		var lines = [[{"X":0,"Y":-14},{"X":-14,"Y":3}],[{"X":-14,"Y":3},{"X":14,"Y":1}],[{"X":14,"Y":1},{"X":0,"Y":-14}],[{"X":-8,"Y":3},{"X":-9,"Y":13}],[{"X":-9,"Y":13},{"X":10,"Y":13}],[{"X":10,"Y":13},{"X":8,"Y":2}]];

		//[[{"X":0,"Y":-9},{"X":-14,"Y":2}],[{"X":-14,"Y":2},{"X":-9,"Y":2}],[{"X":-9,"Y":2},{"X":-9,"Y":12}],[{"X":-9,"Y":12},{"X":10,"Y":12}],[{"X":10,"Y":12},{"X":10,"Y":2}],[{"X":10,"Y":2},{"X":14,"Y":2}],[{"X":14,"Y":2},{"X":0,"Y":-9}]];
		game.context.save();
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		game.context.fillRect(-16, -16, 64, 64);
		game.context.strokeRect(-16, -16, 64, 64);
		art.lines(lines);
		game.context.restore();
	},
	factory: function(x, y, fill, stroke, angle, cannonAngle, notranslate) {
		var lines = [[{"X":-12,"Y":3},{"X":11,"Y":3}],[{"X":10,"Y":3},{"X":10,"Y":-1}],[{"X":10,"Y":-1},{"X":-12,"Y":-1}],[{"X":-12,"Y":-1},{"X":-12,"Y":3}],[{"X":-6,"Y":-1},{"X":-6,"Y":-5}],[{"X":-6,"Y":-5},{"X":2,"Y":-5}],[{"X":2,"Y":-5},{"X":2,"Y":-1}],[{"X":2,"Y":-4},{"X":14,"Y":-4}],[{"X":13,"Y":-3},{"X":2,"Y":-3}],[{"X":-11,"Y":2},{"X":-13,"Y":5}],[{"X":-13,"Y":5},{"X":-10,"Y":7}],[{"X":-10,"Y":7},{"X":10,"Y":7}],[{"X":10,"Y":6},{"X":12,"Y":5}],[{"X":12,"Y":5},{"X":11,"Y":3}]];
		game.context.save();
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		if(notranslate) {
			game.context.fillRect(-16, -16, 32, 32);
			game.context.strokeRect(-16, -16, 32, 32);
		} else {
			game.context.fillRect(-16, -16, 64, 64);
			game.context.strokeRect(-16, -16, 64, 64);
		}
		art.lines(lines);
		game.context.restore();		
	},
	turret: function (x, y, fill, stroke, angle, cannonAngle, notranslate) {
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}
		game.context.rotate(angle);
		game.context.fillRect(-16, -16, 32, 32);
		game.context.strokeRect(-16, -16, 32, 32);
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
	mine: function(x, y, fill, stroke, z, a, notranslate) {
		var lines = [[{"X":-13,"Y":-13},{"X":14,"Y":-13}],[{"X":13,"Y":-13},{"X":13,"Y":15}],[{"X":13,"Y":15},{"X":7,"Y":-7}],[{"X":7,"Y":-7},{"X":-12,"Y":-13}],[{"X":6,"Y":-7},{"X":-14,"Y":12}],[{"X":-14,"Y":12},{"X":-10,"Y":15}],[{"X":-10,"Y":14},{"X":7,"Y":-6}]];
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;		
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}		
		game.context.fillRect(-16, -16, 32, 32);
		game.context.strokeRect(-16, -16, 32, 32);
		//game.context.strokeRect(-16 - 128, -16 - 128, 256 + 32, 256 + 32);
		art.lines(lines);
		game.context.restore();		
	},
	hydroplant: function(x, y, fill, stroke, z, a, notranslate) {
		var lines = [[{"X":-13,"Y":0},{"X":-4,"Y":-10}],[{"X":-4,"Y":-10},{"X":2,"Y":0}],[{"X":2,"Y":0},{"X":9,"Y":-10}],[{"X":-12,"Y":7},{"X":-4,"Y":-2}],[{"X":-4,"Y":-2},{"X":2,"Y":7}],[{"X":2,"Y":7},{"X":9,"Y":-2}]];
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		//game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}		
		game.context.fillRect(-16, -16, 32, 32);
		game.context.strokeRect(-16, -16, 32, 32);
		art.lines(lines);
		game.context.restore();		
	},
	powerplant: function(x, y, fill, stroke, z, a, notranslate) {
		var lines = [[{"X":-1,"Y":-3},{"X":11,"Y":-2}],[{"X":11,"Y":-2},{"X":-10,"Y":10}],[{"X":-10,"Y":10},{"X":1,"Y":0}],[{"X":1,"Y":0},{"X":-13,"Y":-2}],[{"X":-13,"Y":-2},{"X":10,"Y":-10}],[{"X":10,"Y":-10},{"X":-1,"Y":-3}]];
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		//game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		if(!notranslate) {
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		} else {
			game.context.translate(x + tileSize / 2, y + tileSize / 2);
		}		
		game.context.fillRect(-16, -16, 32, 32);
		game.context.strokeRect(-16, -16, 32, 32);
		art.lines(lines);
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