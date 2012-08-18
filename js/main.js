function makeCanvas(w, h) {
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: canvas.getContext("2d") };
}


function testUnits() {
	var p1 = game.spiral(25, {X: 10, Y: 10}),
		p2 = game.spiral(25, {X: 10, Y: 20});

	for( var i = 0; i < 25; i++) {
		game.addUnit(p1[i].X, p1[i].Y, "#3A3");
	}

	for( var i = 0; i < 25; i++) {
		game.addUnit(p2[i].X, p2[i].Y, "#A33");		
	}
}

if(!navigator.isCocoonJS) {
	setInterval(function() {
		game.fps = game.frames;
	    document.getElementById("fps").innerHTML = game.fps;
		game.frames = 0;
	}, 1000);
}

window.addEventListener("load", function() {
	game.init();
	testUnits();
	game.run();
});

