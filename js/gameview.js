//merge into Map object
function gameView(w, h) {
    var c = makeCanvas(w, h);
    gameView.canvas = c.canvas;
    gameView.context = c.context;
    gameView.width = w;
    gameView.height = h;

    var tiles = [
    	procedural.terrain(tileSize, tileSize, bt.Color("#618C32")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#CCE010")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#E6DFC8")),
    	procedural.terrain(tileSize, tileSize, bt.Color("#7A6212"))
    ];
    game.map = ts.TileSet(tiles, procedural.noiseMap(4096, 4096, 40, 4), gameView.canvas, w, h);
    game.mousePosition = bt.Vector(0, 0);
    game.root.add(gameView);
    console.log(game.map.height);
    game.map.draw();
	setInterval(gameView.scrollHandler, 32);
}

gameView.draw = function() {

    game.context.drawImage(gameView.canvas, 0 ,0);
}

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

