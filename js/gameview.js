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

    var tiles = [
        procedural.terrain(tileSize, colors[0]),
        procedural.terrain(tileSize, colors[1]),
        procedural.terrain(tileSize, colors[2]),
        procedural.terrain(tileSize, colors[2]),
         //terrain(tileSize, colors[3]),
        procedural.terrain(tileSize, colors[4])
    ];
    tiles[3].getContext('2d').drawImage(procedural.noise(tileSize, 10, 12, colors[1], 6), 0, 0);
    if(map) {
        game.map = ts.TileSet(tiles, map, gameView.canvas, w, h);    
    } else {
        game.map = ts.TileSet(tiles, procedural.noiseMap(128, 128, 40, 4), gameView.canvas, w, h);
    }
    game.mousePosition = bt.Vector(0, 0);
    game.root.add(gameView);
    game.map.draw();
	setInterval(gameView.scrollHandler, 32);
}

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

