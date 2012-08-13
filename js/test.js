

function makeCanvas(w, h) {
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: context };
}


function displayStuff(img) {
	gameView(800, 800);
	for( var i = 0; i < 15; i++) {
		game.addUnit(10 + i, 10);
	}
	hookEvents();
	render();
}

function hookEvents() {
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
			    	var idx = 0,
			    		p = game.map.at(e.clientX, e.clientY);
				    game.selectedUnits.each(function() {
				    	var to = (function() {
				    		var np = p.add(procedural.spiral(idx));
				    		while(	np.X > 0 && np.Y > 0 &&
				    				np.X < game.collisionMap.length &&
				    				np.Y < game.collisionMap[0].length &&
				    				game.collisionMap[np.X][np.Y] !== collision.PASSABLE) {
				    			idx++;
				    			np = p.add(procedural.spiral(idx));
				    		}
				    		return np;
				    	}());
				        this.go(to);
				        idx++;
				    });
				}
			} else {
				game.deselectAll();
			}
		} else {
			//select inside box
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
}
function render() {
	//game.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	game.frames++;
	game.root.each(function() {
		this.draw();
	});
	if(game.selection) {
		game.context.fillStyle = "rgba(30, 210, 230, 0.5)";
		game.context.fillRect.apply(game.context, game.selection);
	}
    //if(window.webkitRequestAnimationFrame) {
	//	webkitRequestAnimationFrame(render);
    //} else {
    	setTimeout(render, 5);
    //}
}
if(!navigator.isCocoonJS) {
	setInterval(function() {
		game.fps = game.frames;
	    document.getElementById("fps").innerHTML = game.fps;
		game.frames = 0;
	}, 1000);
}

game.makeCanvas = function() {
	game.canvas = document.getElementById("game");
	if(!game.canvas) {
		game.canvas = makeCanvas(800, 800).canvas;
		document.body.appendChild(game.canvas);
	}
	game.context = game.canvas.getContext("2d");
};

window.addEventListener("load", function() {
	game.makeCanvas();
	displayStuff();
});

