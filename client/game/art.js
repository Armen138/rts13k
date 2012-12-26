var art = {
    colorizer: Colorizer(),
    shadowMapper: ShadowMapper(),
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
    tank: function (x, y, fill, selected, angle, cannonAngle, thumbnail) {
        var BODY = 0,
            CANNON = 1;
        if(!thumbnail) {
            var X = x - game.map.offset.X * tileSize + tileSize / 2,
                Y = y - game.map.offset.Y * tileSize + tileSize / 2;
            if (X < window.innerWidth &&
                Y < window.innerHeight &&
                X > 0 &&
                Y > 0) {
                if(selected !== "black") {
                    game.context.strokeStyle = "green";
                    game.context.strokeRect(X - 16, Y - 16, 32, 32);
                }
                tiles.tank.layers[BODY].angle = angle;
                tiles.tank.layers[CANNON].angle = cannonAngle === 0 ? angle : cannonAngle;
                tiles.tank.draw(X, Y, fill);
            }
        } else {
            tiles.tank.layers[BODY].angle = 0;
            tiles.tank.layers[CANNON].angle = 0;
            tiles.tank.draw(x + tileSize / 2, y + tileSize / 2, "#3A3");
        }
    },
    heavyTank: function (x, y, fill, selected, angle, cannonAngle, thumbnail) {
        var BODY = 0,
            CANNON = 1;
        if(!thumbnail) {
            var X = x - game.map.offset.X * tileSize + tileSize / 2,
                Y = y - game.map.offset.Y * tileSize + tileSize / 2;
            if (X < window.innerWidth &&
                Y < window.innerHeight &&
                X > 0 &&
                Y > 0) {
                if(selected !== "black") {
                    game.context.strokeStyle = "green";
                    game.context.strokeRect(X - 16, Y - 16, 32, 32);
                }
                tiles.heavytank.layers[BODY].angle = angle;
                tiles.heavytank.layers[CANNON].angle = cannonAngle === 0 ? angle : cannonAngle;
                tiles.heavytank.draw(X, Y, fill);
            }
        } else {
            tiles.heavytank.layers[BODY].angle = 0;
            tiles.heavytank.layers[CANNON].angle = 0;
            tiles.heavytank.draw(x + tileSize / 2, y + tileSize / 2, "#3A3");
        }
        /*
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
        */
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
        art.lines(lines);
        game.context.restore();
    },
    turret: function (x, y, fill, stroke, angle, cannonAngle, thumbnail) {
        var BODY = 0,
            CANNON = 1;
        if(!thumbnail) {
            var X = x - game.map.offset.X * tileSize + tileSize / 2,
                Y = y - game.map.offset.Y * tileSize + tileSize / 2;
            if (X < window.innerWidth &&
                Y < window.innerHeight &&
                X > 0 &&
                Y > 0) {
                tiles.turret.layers[BODY].angle = angle;
                tiles.turret.layers[CANNON].angle = cannonAngle === 0 ? angle : cannonAngle;
                tiles.turret.draw(X, Y, fill);
            }
        } else {
            tiles.turret.layers[BODY].angle = 0;
            tiles.turret.layers[CANNON].angle = 0;
            tiles.turret.draw(x + tileSize / 2, y + tileSize / 2, "#3A3");
        }
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
    mine: function(x, y, fill, stroke, z, a, thumbnail) {
        if(!thumbnail) {
            var X = x - game.map.offset.X * tileSize + tileSize / 2,
                Y = y - game.map.offset.Y * tileSize + tileSize / 2;
            tiles.mine.draw(X, Y, fill);
        } else {
            game.context.save();
            game.context.translate(x + tileSize / 2, y + tileSize / 2);
            game.context.drawImage(qdip.images.mine, 0, 0, 128, 128, -16, -16, 32, 32);
            game.context.restore();
        }
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
    powerplant: function(x, y, fill, stroke, z, a, thumbnail) {
        if(!thumbnail) {
            var X = x - game.map.offset.X * tileSize + tileSize / 2,
                Y = y - game.map.offset.Y * tileSize + tileSize / 2;
            tiles.powerplant.draw(X, Y, fill);
        } else {
            game.context.save();
            game.context.translate(x + tileSize / 2, y + tileSize / 2);
            game.context.drawImage(qdip.images.powerplant, 0, 0, 128, 128, -16, -16, 32, 32);
            game.context.restore();
        }
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

var Tile = function(images, displaySize) {
    function Layer(image) {
        var frameSize = image.height;//image.width > image.height ? image.height : image.width;
        var frameCount = (image.width / frameSize) | 0;
        var frameDirection = 1;
        var frameTime = 0;
        console.log(frameSize);
        console.log(frameCount);
        var layer = {
            frame: 0,
            image: { neutral: image },
            angle: 0,
            alpha: 1.0,
            fps: 0,
            yoyo: false,
            draw: function(color) {
                if(!layer.image[color]) {
                    color = "neutral";
                }
                game.context.save();
                if(layer.angle !== 0) {
                    game.context.rotate(layer.angle);
                }
                game.context.drawImage(layer.image[color], frameSize * layer.frame, 0, frameSize, frameSize, -16, -16, displaySize, displaySize);
                game.context.restore();
                if(layer.fps !== 0) {
                    var now = (new Date()).getTime();
                    if(now - frameTime > (1000 / layer.fps)) {
                        frameTime = now;
                        layer.frame += frameDirection;
                        if(layer.frame > frameCount - 1 || layer.frame < 0) {
                            if(layer.yoyo) {
                                layer.frame -= frameDirection;
                                frameDirection *= -1;
                            } else {
                                layer.frame = 0;
                            }
                        }
                    }
                }
            },
            cacheColors: function(colors) {
                for(var i = 0; i < colors.length; i++) {
                    hue = art.colorizer.Color(colors[i]).hue;
                    layer.image[colors[i]] = art.colorizer.swapHues(layer.image.neutral, 0, hue);
                    if(!localStorage[image]) {
                        localStorage[image] = "{}";
                    }
                    var cached  = JSON.parse(localStorage[image]);
                    cached[colors[i]] = layer.image[colors[i]].toDataURL();
                    localStorage[image] = JSON.stringify(cached);
                }
            }
        };
        return layer;
    }

    var tile = {
            draw: function(x, y, color) {
                game.context.save();
                game.context.translate(x + 2, y + 2);
                game.context.rotate(tile.layers[0].angle);
                game.context.globalAlpha = 0.6;
                game.context.drawImage(tile.shadow, tile.layers[0].frame * tile.shadow.height, 0, tile.shadow.height, tile.shadow.height, -16, -16, displaySize, displaySize);
                game.context.restore();
                game.context.save();
                game.context.translate(x, y);
                for(var i = 0; i < tile.layers.length; i++) {
                    tile.layers[i].draw(color);
                }
                game.context.restore();
            },
            cacheColors: function(colors) {
                for(var i = 0; i < tile.layers.length; i++) {
                    tile.layers[i].cacheColors(colors);
                }
            },
            layers: [],
            width: images[0].width,
            height: images[0].height
        };

    for(var i = 0; i < images.length; i++) {
        tile.layers.push(Layer(images[i]));
    }
    tile.shadow = art.shadowMapper.shadow(images[0]);
    return tile;
};
var tiles = {};
function loadTiles() {
    tiles = {
        tank: Tile([qdip.images.tankbody, qdip.images.cannon1], 32),
        heavytank: Tile([qdip.images.tankbody2, qdip.images.cannon2], 32),
        powerplant: Tile([qdip.images.powerplant_active], 64),
        mine: Tile([qdip.images.mine], 64),
        turret: Tile([qdip.images.turretbody, qdip.images.turretcannon], 32)
    };

    tiles.tank.cacheColors(["#3A3","#A3A","#AA3","#33A"]);
    tiles.heavytank.cacheColors(["#3A3","#A3A","#AA3","#33A"]);
    tiles.powerplant.cacheColors(["#3A3","#A3A","#AA3","#33A"]);
    tiles.mine.cacheColors(["#3A3","#A3A","#AA3","#33A"]);
    tiles.turret.cacheColors(["#3A3","#A3A","#AA3","#33A"]);
    tiles.powerplant.layers[0].fps = 8;
    tiles.powerplant.layers[0].yoyo = true;

}
