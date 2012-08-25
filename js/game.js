var tileSize = 32,
    game = {
        tileSize: 32,
        root: ns.Node(),
        count: 0,
        frames: 0,
        selectedUnits: ns.Node(),
        mousePosition: {X: 0, Y: 0},
        units: ns.Node(),
        enemy: ns.Node(),
        fps: 0,
        playerCount: 0,
        players: [],
        buildMode: null,
        collisionMap: [],
        map: [],
        energy: 0,
        enegyMax: 0,
        colors: [
            "#3A3",
            "#A3A",
            "#AA3"
        ]
    }, collision = {
        PASSABLE: 0,
        UNPASSABLE: 1,
        UNIT: 2,
        STRUCTURE: 3,
        RESERVED: 4
    };

game.deselectAll = function() {
    game.selectedUnits.each(function() {
        this.deselect();
    });
    game.selectedUnits.clear();
};

game.init = function() {
    game.canvas = document.getElementById("game");
    game.context = game.canvas.getContext("2d");
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
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
            if( ui.has(e.clientX, e.clientY) ) {
                game.uiDrag = {X: e.clientX - ui.hudPosition.X, Y: e.clientY - ui.hudPosition.Y };
            }        

            if(!game.uiDrag) {
                if(w < 0) { topLeft.X += w; w *= -1; }
                if(h < 0) { topLeft.Y += h; h *= -1; }
                game.selection = [topLeft.X, topLeft.Y,  w, h];
            } else {
                ui.alpha = 0.5;
                ui.hudPosition = {X: topLeft.X + w - game.uiDrag.X, Y: topLeft.Y + h - game.uiDrag.Y};
            }
        }
    });
    game.canvas.addEventListener("mouseup", function(e) {
        game.dragStart.release();
        game.mouseDown = false;
        if( ui.has(e.clientX, e.clientY) ) {
            ui.click(e.clientX - ui.hudPosition.X, e.clientY - ui.hudPosition.Y);
        } else {
            if(game.buildMode) {
                if(e.button === 0) {
                    var buildable = game.buildMode,
                        pos = {X: (e.clientX / tileSize + game.map.offset.X) | 0, Y: (e.clientY / tileSize + game.map.offset.Y) | 0};
                    console.log(game.players[0]);
                    game.players[0].build(pos.X, pos.Y, buildable);
                }
                if(!e.shiftKey) {
                    game.buildMode = null;
                }
            } else {
                if(!game.uiDrag) {
                    if(game.dragStart.distanceTo({X: e.clientX, Y: e.clientY }) < 32) {
                        var selected = false;
                        if(e.button === 0) {
                            game.units.each(function() {
                                if(this.click(e.clientX, e.clientY)) {
                                    selected = true;
                                }
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
                            if(this.isInside(game.selection) && this.owner.local && this.mobile) {
                                this.select();
                                game.selectedUnits.add(this);
                            }
                        });
                    }
                }                 
            }
        }
        game.uiDrag = false;
        ui.alpha = 1.0;
        
        game.selection = null;
        return false;
    });
    //gameView(800, 800);
    gameView(window.innerWidth, window.innerHeight);
};


game.run = function() {
    game.frames++;
    for(var i = 0; i < game.players.length; i++) {
        game.players[i].update();
    }
    game.root.each(function() {
        this.draw();
    });
    if(game.selection) {
        game.context.fillStyle = "rgba(30, 210, 230, 0.5)";
        game.context.fillRect.apply(game.context, game.selection);
    }
    if(game.buildMode) {
        game.buildMode.art(game.mousePosition.X - game.mousePosition.X % 32 , game.mousePosition.Y - game.mousePosition.Y % 32 , "grey", "black", 0, 0, true);
        //sconsole.log(game.mousePosition.X - game.mousePosition.X % 32 );
    }
    ui.draw();

    //ts.collisionDebug();
    setTimeout(game.run, 5);
};

game.unitAt = function(pos) {
    var unit = null;
    game.units.each(function(){
        //console.log(this.tile);
        //console.log(pos);
        if(this.tile.X === pos.X && this.tile.Y === pos.Y) {
            unit = this;
        }
    });
    return unit;
};

game.spiral = function(n, p) {
    var x = 0,
    y = 0,
    dx = 0,
    dy = -1,
    t,
    positions = [];
    if(game.collisionMap[p.X][p.Y] === collision.PASSABLE) {
        positions.push({X: p.X, Y: p.Y});
    }

    while(positions.length < n) {
        if( (x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1-y))) {
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
};