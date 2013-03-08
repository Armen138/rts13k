define(["canvas", "settings", "resources"], function(Canvas, settings, Resources) {
	Resources.load({	
		"tile1": "images/tile1.png",
		"tile2": "images/tile2.png",
		"element1": "images/element1.png"
	});
	var Map = function(data, clients) {
		console.log("map size: " + data.length + "x" + data[0].length);
		console.log("px size: " + data.length * settings.tileSize + "x" + data[0].length * settings.tileSize);
		var mapCanvas = Canvas.create({width: data.length * settings.tileSize, height: data[0].length * settings.tileSize});
		var minimap = Canvas.create({width: 128, height: 128});

		for(var x = 0; x < mapCanvas.width; x+= Resources.tile1.width) {
			for(var y = 0; y < mapCanvas.height; y+= Resources.tile1.height) {
				var cointoss = Math.random() > 0.5 ? Resources.tile1 : Resources.tile2;
				mapCanvas.context.drawImage(cointoss, x, y);		
			}					
		}

		minimap.context.drawImage(mapCanvas.element, 0, 0, mapCanvas.width, mapCanvas.height, 0, 0, 128, 128);
		var drag = {
			start: {X: 0, Y: 0},
			mapStart: {X: 0, Y: 0},
			active: false
		};

		var capPosition = function() {
			if(map.position.X < 0) {
				map.position.X = 0;
			}					
			if(map.position.Y < 0) {
				map.position.Y = 0;
			}
			if(map.position.X > mapCanvas.width - settings.viewPort.width) {
				map.position.X = mapCanvas.width - settings.viewPort.width;
			}
			if(map.position.Y > mapCanvas.height - settings.viewPort.height) {
				map.position.Y = mapCanvas.height - settings.viewPort.height;
			}
		};

		var map = {
			position: {X: 0, Y: 0},
			mini: {
				draw: function() {
					Canvas.context.drawImage(minimap.element, 10, 10);
				}
			},
			draw: function() {
				Canvas.context.save();
				Canvas.context.drawImage(mapCanvas.element, map.position.X, map.position.Y, settings.viewPort.width - settings.hud.width, settings.viewPort.height, settings.hud.width, 0, settings.viewPort.width - settings.hud.width, settings.viewPort.height);
				Canvas.context.translate(-map.position.X + settings.hud.width, -map.position.Y);
				//draw entities on map
				Canvas.context.fillStyle = "green";
				Canvas.context.fillRect(100, 100, 32, 32);
				for(var c in clients) {
					clients[c].draw();
				}
				Canvas.context.restore();
			},
			centerOn: function(position) {
				map.position.X = (position.X * settings.tileSize) - settings.viewPort.width / 2;
				map.position.Y = (position.Y * settings.tileSize) - settings.viewPort.height / 2;
				capPosition();
			},
			mousemove: function(position) {
				if(drag.active) {
					var diff = {
						X: drag.start.X - position.X,
						Y: drag.start.Y - position.Y
					};
					map.position.X = drag.mapStart.X + diff.X;
					map.position.Y = drag.mapStart.Y + diff.Y;
					capPosition();
				}
			},
			mousedown: function(position, button) {
				if(button === 2) {
					drag.mapStart = {X: map.position.X, Y: map.position.Y};
					drag.start = position;
					drag.active = true;					
				}
			},
			mouseup: function(position, button) {
				drag.active = false;
			}
		};
		return map;
	};
	return Map;
});