//merge into Map object
function gameView(wx, hx) {
    var w = wx - wx % 32 + 32,
        h = hx - hx % 32 + 32;
    var c = makeCanvas(w, h),
        colors = [  bt.Color("#152568"),
                    bt.Color("#CCE010"),
                    bt.Color("#E6DFC8"),
                    bt.Color("#7A6212")
                ];
    gameView.canvas = c.canvas;
    gameView.context = c.context;
    gameView.width = w;
    gameView.height = h;

    var tiles = [
        procedural.terrain(tileSize, colors[0]),
        procedural.terrain(tileSize, colors[1]),
        procedural.terrain(tileSize, colors[2]),
        procedural.terrain(tileSize, colors[3]),
        procedural.terrainltr(tileSize, colors[0], colors[1]),
        procedural.terrainltr(tileSize, colors[1], colors[0])
    ];
    game.map = ts.TileSet(tiles, procedural.noiseMap(128, 128, 40, 4), gameView.canvas, w, h);
    game.mousePosition = bt.Vector(0, 0);
    game.root.add(gameView);
    game.map.draw();
	setInterval(gameView.scrollHandler, 32);
}

gameView.draw = function() {

    game.context.drawImage(gameView.canvas, 0 ,0);
};

gameView.scrollHandler = function() {
    if(!game.map) return;
    if(game.mousePosition.X < tileSize * 2)
        if(game.map.offset.X > 0) game.map.horizontal(1);
    if(game.mousePosition.X > gameView.width - tileSize * 2)
        if(game.map.offset.X < game.map.width - gameView.width / tileSize) game.map.horizontal(-1);
    if(game.mousePosition.Y < tileSize * 2)
        if(game.map.offset.Y > 0) game.map.vertical(1);
    if(game.mousePosition.Y > game.canvas.height - tileSize * 2)
        if(game.map.offset.Y < game.map.height - ((game.canvas.height / tileSize + .5) | 0)) game.map.vertical(-1);
};

