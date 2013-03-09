define(["canvas", "settings", "resources", "simplex"], function(Canvas, settings, Resources, Simplex) {
    Resources.load({    
        "tile1": "images/tile1.png",
        "tile2": "images/tile2.png",
        "element1": "images/element1.png"
    });
    var Map = function(data, clients) {
        Simplex.setseed(data.seeds);
        var scale = settings.tileSize;
        var lvl = 4;
        var res = 50 * scale;
        var mapTiles = [];
        for(var x = 0; x < data.width * scale; x++) {
             mapTiles[x] = [];
             for(var y = 0; y < data.height * scale; y++) {
                 mapTiles[x][y] = parseInt((((Simplex.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
             }
        }


        console.log("map size: " + data.width + "x" + data.height);
        console.log("px size: " + data.width * settings.tileSize + "x" + data.height * settings.tileSize);
        var mapCanvas = Canvas.create({width: data.width * settings.tileSize, height: data.height * settings.tileSize});
        var minimap = Canvas.create({width: 128, height: 128});
        //var blobCanvas = mapCanvas.clone(true);
        // mapCanvas.context.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
        // mapTiles.tileSize = (data.width * settings.tileSize) / mapTiles.length; 
        // for(var x = 0; x < mapTiles.length; x++) {
        //     for(var y = 0; y < mapTiles[0].length; y++) {
        //         mapCanvas.context.fillStyle = "white"; //tileColors[mapTiles[x][y]];
        //         if(mapTiles[x][y] === 0) {
        //             mapCanvas.context.fillRect(x * mapTiles.tileSize + mapTiles.tileSize/2, y * mapTiles.tileSize + mapTiles.tileSize/2, mapTiles.tileSize, mapTiles.tileSize);    
        //         }                
        //     }
        // }
        // mapCanvas.context.globalCompositeOperation = "xor";
        for(var x = 0; x < mapCanvas.width; x+= Resources.tile1.width) {
            for(var y = 0; y < mapCanvas.height; y+= Resources.tile1.height) {
                var cointoss = Math.random() > 0.5 ? Resources.tile1 : Resources.tile2;
                mapCanvas.context.drawImage(cointoss, x, y);        
            }                   
        }
        tileColors = [
            "rgba(0, 0, 200, 0.4)",
            "rgba(0, 0, 0, 0.5)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(0, 0, 0, 0)"
        ];

        var mapPixels = mapCanvas.imageData();
        for(var x = 0; x < mapTiles.length; x++) {
            for(var y = 0; y < mapTiles[0].length; y++) {
                mapPixels.data[y * (mapPixels.width * 4) + x * 4 + 2] = 255 / mapTiles[x][y] | 0;
            }
        }
        mapCanvas.imageData(mapPixels);

        // mapTiles.tileSize = (data.width * settings.tileSize) / mapTiles.length; 
        // for(var x = 0; x < mapTiles.length; x++) {
        //     for(var y = 0; y < mapTiles[0].length; y++) {
        //         mapCanvas.context.fillStyle = tileColors[mapTiles[x][y]];
        //         mapCanvas.context.fillRect(x * mapTiles.tileSize + mapTiles.tileSize/2, y * mapTiles.tileSize + mapTiles.tileSize/2, mapTiles.tileSize, mapTiles.tileSize);
        //     }
        // }

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
                //ensure nothing gets drawn outside the map area
                Canvas.context.beginPath();
                Canvas.context.moveTo(settings.hud.width, 0);
                Canvas.context.lineTo(settings.hud.width, settings.viewPort.height);
                Canvas.context.lineTo(settings.viewPort.width, settings.viewPort.height);
                Canvas.context.lineTo(settings.viewPort.width, 0);
                Canvas.context.closePath();
                Canvas.context.clip();
                Canvas.context.drawImage(mapCanvas.element, map.position.X, map.position.Y, settings.viewPort.width - settings.hud.width, settings.viewPort.height, settings.hud.width, 0, settings.viewPort.width - settings.hud.width, settings.viewPort.height);
                Canvas.context.translate(-map.position.X + settings.hud.width, -map.position.Y);
                //draw entities on map                
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