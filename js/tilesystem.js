/*
	ts tile system. A way to organise tiles to render in an orthographic way. Requeres ns (nodes), bt (basictypes)
*/
var ts = {};
ts.pickTile = function(map, x, y) {
	var t = map[x][y];
	/*if(t == 0) {
		if(x > 0 && map[x-1][y] !== t) {
			return 4;
		}
		if(x < map.length - 1 && map[x + 1][y] !== t) {
			return 5;
		}
	}*/
	return t;
};
ts.collisionDebug = function() {
	if(game.map.offset) {
		var screenSize = bt.Vector(800 / tileSize, 800 / tileSize);
		var br = game.map.offset.add(screenSize);
		for(var x = game.map.offset.X; x < br.X; x++) {
			for(var y = game.map.offset.Y; y < br.Y; y++) {
				if(game.collisionMap[x][y] != 0) {
					var fill = "rgba(255, 0, 0, 0.5)";
					if(game.collisionMap[x][y] === collision.RESERVED) {
						fill = "rgba(0, 0, 255, 0.5)";
					}
					game.context.fillStyle = fill;
					game.context.fillRect((x - game.map.offset.X) * tileSize, (y - game.map.offset.Y) * tileSize, tileSize, tileSize);
				}

			}
		}
		br.release();
	}
}
ts.TileSet = function(tilearray, map, canvas, w, h) {
	console.log(tilearray);
	var gridSize = map.length,
		screenSize = bt.Vector(w / tileSize, h / tileSize),
		context = canvas.getContext("2d"),
		color = ["#152568", "#CCE010", "#E6DFC8", "#7A6212"],
		tileSet = Object.create(ns.Node(), {
			screenSize: {
				value: screenSize
			},
			/*at: {
				value: function(x, y) {
					return bt.Vector((x / tileSize + tileSet.offset.X) | 0, (y / tileSize + tileSet.offset.Y) | 0);
				}
			},*/
			width: {
				value: map.length
			},
			height: {
				value: map[0].length
			},
			at: {
				value: function(x, y) {
					x -= gameView.offset.X;
					y -= gameView.offset.Y;
					return bt.Vector((x / tileSize | 0)+ game.map.offset.X, (y / tileSize | 0) + game.map.offset.Y);
				}
			},
			horizontal: {
				value: function(d) {
					context.drawImage(canvas, tileSize * d, 0);
					tileSet.offset.X -= d;					
					for(var y = 0 + tileSet.offset.Y; y < tileSet.offset.Y + screenSize.Y; y++) {
						var x = (d < 0 ? screenSize.X: 0) + tileSet.offset.X - (d < 0 ? 1 : 0),
							tile = tilearray[ts.pickTile(map, x, y)];
						if(tile)
							context.drawImage(tile, (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
					}
				}
			},
			vertical: {
				value: function(d) {
					context.drawImage(canvas, 0, tileSize * d);
					tileSet.offset.Y -= d;
					for(var x = 0 + tileSet.offset.X; x < tileSet.offset.X + screenSize.X; x++) {
						var y = (d < 0 ? screenSize.Y : 0) + tileSet.offset.Y - (d < 0 ? 1 : 0),
							tile = tilearray[ts.pickTile(map, x, y)];
						if(tile)
							context.drawImage(tile, (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
					}
				}
			},
			draw: {
				value: function() {
					if(tileSet.offset) {
						var br = tileSet.offset.add(screenSize);
						for(var x = tileSet.offset.X; x < br.X; x++) {
							for(var y = tileSet.offset.Y; y < br.Y; y++) {
								context.drawImage(tilearray[ts.pickTile(map, x, y)], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
							}
						}
						br.release();
					}
				}
			},
			drawMini: {
				value: function() {
					var minicanvas = document.createElement('canvas');
					minicanvas.width = 128;
					minicanvas.height = 128;
					var minicontext = minicanvas.getContext('2d');
					if(tileSet.offset) {
						var br = tileSet.offset.add(screenSize);
						for(var x = 0; x < 128; x++) {
							for(var y = 0; y < 128; y++) {
								//context.drawImage(tilearray[ts.pickTile(map, x, y)], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
								minicontext.fillStyle = color[map[x][y] / 14 | 0];
								minicontext.fillRect(x, y, 1, 1);//tilearray[ts.pickTile(map, x, y)], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
								//minicontext.drawImage(tilearray[ts.pickTile(map, x, y)], x , y);
							}
						}
						br.release();
					}
					return minicanvas;
				}
			},			
			map: { value : map }
		});


    tileSet.offset = bt.Vector(0, 0);
	return tileSet;
}