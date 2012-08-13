var tileSize = 32,
    game = {
        tileSize: 32,
    	root: ns.Node(),
    	count: 0,
    	frames: 0,
    	selectedUnits: ns.Node(),
    	units: ns.Node(),
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

game.addUnit = function(x, y) {
    var unit = Unit(x, y);
    game.units.draw = function() {
        game.units.each(function() {
            this.draw();
        });
    }
    //game.selectedUnits.add(unit);
    unit.on("click", (function(unit) {
        return function() {
            game.deselectAll();
            unit.select();
            game.selectedUnits.add(unit);
        }
    }(unit)));
    game.units.add(unit);
    game.root.add(game.units);
}

