var art = {
	tank: function (x, y, fill, stroke, angle, cannonAngle) {
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
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
	base: function(x, y, fill, stroke) {
		var lines = [[{"X":0,"Y":-9},{"X":-14,"Y":2}],[{"X":-14,"Y":2},{"X":-9,"Y":2}],[{"X":-9,"Y":2},{"X":-9,"Y":12}],[{"X":-9,"Y":12},{"X":10,"Y":12}],[{"X":10,"Y":12},{"X":10,"Y":2}],[{"X":10,"Y":2},{"X":14,"Y":2}],[{"X":14,"Y":2},{"X":0,"Y":-9}]];
		game.context.save();
		game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		game.context.fillRect(-16, -16, 64, 64);
		game.context.strokeRect(-16, -16, 64, 64);
		art.lines(lines);
		game.context.restore();
	},
	turret: function (x, y, fill, stroke, angle, cannonAngle) {
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
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
	powerplant: function(x, y, fill, stroke) {
		var lines = [[{"X":-1,"Y":-3},{"X":11,"Y":-2}],[{"X":11,"Y":-2},{"X":-10,"Y":10}],[{"X":-10,"Y":10},{"X":1,"Y":0}],[{"X":1,"Y":0},{"X":-13,"Y":-2}],[{"X":-13,"Y":-2},{"X":10,"Y":-10}],[{"X":10,"Y":-10},{"X":-1,"Y":-3}]];
		game.context.save();
		game.context.fillStyle = fill;
		game.context.strokeStyle = stroke;
		game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
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