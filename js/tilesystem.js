/*
	ts tile system. A way to organise tiles to render in an orthographic way. Requeres ns (nodes), bt (basictypes)
*/
var ts = {};

ts.TileSet = function(tilearray, map, canvas, w, h) {
	console.log(tilearray);
	var gridSize = map.length,
		screenSize = bt.Vector(w / tileSize, h / tileSize),
		context = canvas.getContext("2d"),
		tileSet = Object.create(ns.Node(), {
			at: {
				value: function(x, y) {
					return bt.Vector((x / tileSize + tileSet.offset.X) | 0, (y / tileSize + tileSet.offset.Y) | 0);
				}
			},
			width: {
				value: map.length
			},
			height: {
				value: map[0].length
			},
			at: {
				value: function(x, y) {
					return bt.Vector((x / tileSize | 0)+ game.map.offset.X, (y / tileSize | 0) + game.map.offset.Y);
				}
			},
			horizontal: {
				value: function(d) {
					context.drawImage(canvas, tileSize * d, 0);
					tileSet.offset.X -= d;
					for(var y = 0 + tileSet.offset.Y; y < tileSet.offset.Y + screenSize.Y; y++) {
						var x = (d < 0 ? screenSize.X : 0) + tileSet.offset.X - (d < 0 ? 1 : 0);
						context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
					}
				}
			},
			vertical: {
				value: function(d) {
					context.drawImage(canvas, 0, tileSize * d);
					tileSet.offset.Y -= d;
					for(var x = 0 + tileSet.offset.X; x < tileSet.offset.X + screenSize.X; x++) {
						var y = (d < 0 ? screenSize.Y : 0) + tileSet.offset.Y - (d < 0 ? 1 : 0);
						context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
					}
				}
			},
			draw: {
				value: function() {
					if(tileSet.offset) {

						var br = tileSet.offset.add(screenSize);
						for(var x = tileSet.offset.X; x < br.X; x++) {
							for(var y = tileSet.offset.Y; y < br.Y; y++) {
								context.drawImage(tilearray[map[x][y]], (x - tileSet.offset.X) * tileSize, (y - tileSet.offset.Y) * tileSize);
							}
						}
						br.release();
					}
				}
			}
		});

	//create initial collision map
	for(var x = 0; x < map.length; x++) {
		game.collisionMap[x] = new Uint8Array(map[0].length);
		for(var y = 0; y < map[0].length; y++) {
			if(map[x][y] === 0) {
				game.collisionMap[x][y] = collision.UNPASSABLE;
			} else {
				game.collisionMap[x][y] = collision.PASSABLE;
			}
		}
	}
    tileSet.offset = bt.Vector(0, 0);
	return tileSet;
}