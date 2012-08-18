var tileSize = 32,
    game = {
        tileSize: 32,
    	root: ns.Node(),
    	count: 0,
    	frames: 0,
    	selectedUnits: ns.Node(),
    	units: ns.Node(),
        enemy: ns.Node(),
    	fps: 0,
        collisionMap: [],
        map: []
    }, collision = {
        PASSABLE: 0,
        UNPASSABLE: 1,
        UNIT: 2,
        RESERVED: 3
    };

game.deselectAll = function() {
    game.selectedUnits.each(function() {
        this.deselect();
    });
    game.selectedUnits.clear();
};

game.init = function() {
    game.canvas = document.getElementById("game");
    /*if(!game.canvas) {
        game.canvas = makeCanvas(800, 800).canvas;
        document.body.appendChild(game.canvas);
    }*/
    game.context = game.canvas.getContext("2d");

    game.canvas.addEventListener("mousedown", function(e) {
        game.mouseDown = true;
        game.dragStart = bt.Vector(e.clientX, e.clientY);
    });
    game.canvas.addEventListener("mousemove", function(e) {
        game.mousePosition.X = e.clientX;
        game.mousePosition.Y = e.clientY;
        if(game.mouseDown) {
            var topLeft= game.dragStart.shallow(),
                w = e.clientX - game.dragStart.X,
                h = e.clientY - game.dragStart.Y;
            if(w < 0) { topLeft.X += w; w *= -1; }
            if(h < 0) { topLeft.Y += h; h *= -1; }
            game.selection = [topLeft.X, topLeft.Y,  w, h];
        }
    });
    game.canvas.addEventListener("mouseup", function(e) {
        game.dragStart.release();
        game.mouseDown = false;
        if(game.dragStart.distanceTo({X: e.clientX, Y: e.clientY }) < 16) {
            var selected = false;
            if(e.button === 0) {
                game.units.each(function() {
                    if(this.click(e.clientX, e.clientY)) {
                        selected = true;
                    };
                });
                if(!selected) {
                    var p = game.map.at(e.clientX, e.clientY),
                        destinations = game.spiral(game.selectedUnits.length, p);
                    game.selectedUnits.each(function() {                        
                        this.go(destinations.shift());
                    });                    
                }
            } else {
                game.deselectAll();
            }
        } else {
            //select inside box
            game.deselectAll();
            game.units.each(function() {
                if(this.isInside(game.selection)) {
                    this.select();
                    game.selectedUnits.add(this);
                }
            });
        }
        game.selection = null;
        return false;
    });

    game.units.draw = function() {
        game.units.each(function() {
            this.draw();
        });
    }
    gameView(800, 800);
    game.root.add(game.units);
};

game.addUnit = function(x, y, color) {
    var unit = Unit(x, y, color);
    //game.selectedUnits.add(unit);
    unit.on("click", (function(unit) {
        return function() {
            game.deselectAll();
            unit.select();
            game.selectedUnits.add(unit);
        }
    }(unit)));
    game.units.add(unit);
};

game.run = function() {
    game.frames++;
    game.root.each(function() {
        this.draw();
    });
    if(game.selection) {
        game.context.fillStyle = "rgba(30, 210, 230, 0.5)";
        game.context.fillRect.apply(game.context, game.selection);
    }
    //ts.collisionDebug();
    setTimeout(game.run, 5);
};

game.spiral = function(n, p) {
    var x = 0,
    y = 0,
    dx = 0,
    dy = -1,
    t,
    positions = [{X: p.X, Y: p.Y}];

    while(positions.length < n) {
        if( (x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1-y))){
            t = dx;
            dx = -dy;
            dy = t;
        }
        x += dx;
        y += dy;        
        if(game.collisionMap[p.X + x][p.Y + y] === collision.PASSABLE) {
            positions.push({X: p.X + x, Y: p.Y + y});
        }
    }
    return positions;
}