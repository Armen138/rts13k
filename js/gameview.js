//merge into Map object
function gameView(wx, hx, map) {
    var w = wx - wx % 32 + 32,
        h = hx - hx % 32 + 32;
    var c = makeCanvas(w, h),
        colors = [  bt.Color("#152568"), //0
                    bt.Color("#CCE010"),
                    bt.Color("#E6DFC8"),
                    bt.Color("#7A6212"),
                    bt.Color("#00e17f") //4
                ];
    gameView.canvas = c.canvas;
    gameView.context = c.context;
    gameView.width = w;
    gameView.height = h;

    function terrainTile(idx) {
        var c = document.createElement("canvas"),
            ctx = c.getContext("2d"),
            x = idx % 28,
            y = idx / 28 | 0;
            //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(qdip.images.terrain, x * 32, y * 32, 32, 32, 0, 0, 32, 32);
        return c;
    }
    var base = [3, 5];
    var sets = [11 * 14, 10 * 14, 50 * 14, 52 * 14];
    var set = base[0] * 14;
    var set1 = base[1] * 14;
    var tileSet = [];
    for(var n = 0; n < 4; n++) {
        for(var i = 0; i < 14; i++) {
            tileSet.push(terrainTile(sets[n] + i));
        }        
    }
    var tiles = [        
        terrainTile(set + 4),                            //0
        terrainTile(set1 + 4),                            //1
        procedural.terrain(tileSize, colors[2]),    //2
        procedural.terrain(tileSize, colors[2]),    //3
        procedural.terrain(tileSize, colors[4]),    //4
        terrainTile(set + 5),                            //5
        terrainTile(set + 3),                            //6
        terrainTile(set + 2),                            //7
        terrainTile(set + 10),                            //8
        terrainTile(set + 1),                            //9
        terrainTile(set + 7),                            //10
        terrainTile(set),                            //11
        terrainTile(set + 12),                             //12
        terrainTile(set + 8),                            //13
        terrainTile(set + 9),                             //14
        terrainTile(set + 6),                             //15
        terrainTile(set + 11)                             //16
    ];
    //create initial collision map
    for(var x = 0; x < map.length; x++) {
        game.collisionMap[x] = new Uint8Array(map[0].length);
        for(var y = 0; y < map[0].length; y++) {
            if(ts.pickTile(map, x, y) === 0) {
                game.collisionMap[x][y] = collision.UNPASSABLE;
            } else {
                game.collisionMap[x][y] = collision.PASSABLE;
            }
        }
    }    
    tiles[3].getContext('2d').drawImage(procedural.noise(tileSize, 10, 12, colors[1], 6), 0, 0);

    if(map) {
        var tileMap = [];
        gameView.mapTileSet(3, tileMap, map, 2);
        gameView.mapTileSet(2, tileMap, map, 1);
        gameView.mapTileSet(1, tileMap, map, 0);
        gameView.mapTileSet(0, tileMap, map, 0);
        /*
        for(var tx = 0; tx < map.length; tx++) {
            tileMap[tx] = [];
            for(var ty = 0; ty < map[0].length; ty++) {
                var tile = map[tx][ty];
                tileMap[tx][ty] = tile;
                if(tile === 0) {
                    if (rightOf(tx, ty) !== tile) {
                        tileMap[tx][ty] = 5;
                    }
                    if (leftOf(tx, ty) !== tile) {
                        tileMap[tx][ty] = 6;
                    }
                    if (above(tx, ty) !== tile) {
                        tileMap[tx][ty] = 9;
                    }        
                    if (below(tx, ty) !== tile) {
                        tileMap[tx][ty] = 10;
                    }        
                    if (rightOf(tx, ty) !== tile && 
                        above(tx, ty) !== tile) {
                        tileMap[tx][ty] = 7;
                    }
                    if (leftOf(tx, ty) !== tile && 
                        below(tx, ty) !== tile) {
                        tileMap[tx][ty] = 15;
                    }                    

                    if (rightOf(tx, ty) !== tile && 
                        below(tx, ty) !== tile) {
                        tileMap[tx][ty] = 13;
                    }                    
                    if (leftOf(tx, ty) !== tile && 
                        above(tx, ty) !== tile) {
                        tileMap[tx][ty] = 11;
                    }  
                    if (leftOf(tx, ty) == tile && 
                        above(tx, ty) == tile &&
                        aboveLeft(tx, ty) !== tile) {
                        tileMap[tx][ty] = 14;
                    }  
                    if (rightOf(tx, ty) == tile && 
                        above(tx, ty) == tile &&
                        aboveRight(tx, ty) !== tile) {
                        tileMap[tx][ty] = 8;
                    }      
                    if (rightOf(tx, ty) == tile && 
                        below(tx, ty) == tile &&
                        belowRight(tx, ty) !== tile) {
                        tileMap[tx][ty] = 12;
                    }                                   
                    if (leftOf(tx, ty) == tile && 
                        below(tx, ty) == tile &&
                        belowLeft(tx, ty) !== tile) {
                        tileMap[tx][ty] = 16;
                    }                    
                }

            }
        }*/
        game.map = ts.TileSet(tileSet, tileMap, gameView.canvas, w, h);    
    }
    game.mousePosition = bt.Vector(0, 0);
    game.root.add(gameView);
    game.map.draw();
	setInterval(gameView.scrollHandler, 32);
}

gameView.mapTileSet = function(tile, tileMap, map, except) {
    function leftOf(x, y, tiles) {
        if(x > 0) {
            return (map[x -1][y] == tiles[0] ||
                    map[x -1][y] == tiles[1]);
        }
        return true;
    }
    function rightOf(x, y, tiles) {
        if(x < map.length - 1) {
            return (map[x  + 1][y] == tiles[0] ||
                    map[x  + 1][y] == tiles[1]);
        }
        return true;
    }    
    function above(x, y, tiles) {
        if(y > 0) {
            return (map[x][y - 1] == tiles[0] ||
                    map[x][y - 1] == tiles[1]); 
        }
        return true;
    }
    function below(x, y, tiles) {
        if(y < map[0].length -1) {
            return (map[x][y + 1] == tiles[0] ||
                    map[x][y + 1] == tiles[1]);
        }
        return true;
    }
    function aboveRight(x, y, tiles) {
        if(x < map.length -1 && y > 0) {
            return (map[x + 1][y - 1] == tiles[0] ||
                    map[x + 1][y - 1] == tiles[1]);
        }
        return true;
    }
    function aboveLeft(x, y, tiles) {
        if(x > 0 && y > 0) {
            return (map[x - 1][y - 1] == tiles[0] ||
                    map[x - 1][y - 1] == tiles[1]);
        }
        return true;
    }    
    function belowRight(x, y, tiles) {
        if(x < map.length -1 && y < map[0].length -1) {
            return (map[x + 1][y + 1] == tiles[0] ||
                    map[x + 1][y + 1] == tiles[1]);
        }
        return true;
    }
    function belowLeft(x, y, tiles) {
        if(x > 0 && y < map[0].length -1) {
            return (map[x - 1][y + 1] == tiles[0] ||
                    map[x - 1][y + 1] == tiles[1]);
        }
        return true;
    }        
    var baseTile = tile * 14;
    for(var tx = 0; tx < map.length; tx++) {
        if(!tileMap[tx]) {
            tileMap[tx] = [];
        }
        for(var ty = 0; ty < map[0].length; ty++) {
            //tileMap[tx][ty] = tile;
            if(tile === map[tx][ty]) {
                tileMap[tx][ty] = baseTile + 4;
                if (!rightOf(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 5;
                }
                if (!leftOf(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 3;
                }
                if (!above(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 1;
                }        
                if (!below(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 7;
                }        
                if (!rightOf(tx, ty, [tile, except]) && 
                    !above(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 2;
                }
                if (!leftOf(tx, ty, [tile, except]) && 
                    !below(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 6;
                }                    
                if (!rightOf(tx, ty, [tile, except]) && 
                    !below(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 8;
                }                    
                if (!leftOf(tx, ty, [tile, except]) && 
                    !above(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile;
                }  
                if (leftOf(tx, ty, [tile, except]) && 
                    above(tx, ty, [tile, except]) &&
                    !aboveLeft(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 9;
                }  
                if (rightOf(tx, ty, [tile, except]) && 
                    above(tx, ty, [tile, except]) &&
                    !aboveRight(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 10;
                }      
                if (rightOf(tx, ty, [tile, except]) && 
                    below(tx, ty, [tile, except]) &&
                    !belowRight(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 12;
                }                                   
                if (leftOf(tx, ty, [tile, except]) && 
                    below(tx, ty, [tile, except]) &&
                    !belowLeft(tx, ty, [tile, except])) {
                    tileMap[tx][ty] = baseTile + 11;
                }                    
            } else {
                if(!tileMap[tx][ty]) {
                    tileMap[tx][ty] = baseTile;
                }
            }
        }    
    }
};
gameView.draw = function() {

    game.context.drawImage(gameView.canvas, 0 ,0);
};

gameView.scrollHandler = function() {
    if(!game.map || ui.has(game.mousePosition.X, game.mousePosition.Y)) return;
    if(game.mousePosition.X < tileSize * 2)
        if(game.map.offset.X > 0) game.map.horizontal(1);
    if(game.mousePosition.X > gameView.width - tileSize * 2)
        if(game.map.offset.X < game.map.width - gameView.width / tileSize) game.map.horizontal(-1);
    if(game.mousePosition.Y < tileSize * 2)
        if(game.map.offset.Y > 0) game.map.vertical(1);
    if(game.mousePosition.Y > game.canvas.height - tileSize * 2)
        if(game.map.offset.Y < game.map.height - ((game.canvas.height / tileSize + 0.5) | 0)) game.map.vertical(-1);
};

