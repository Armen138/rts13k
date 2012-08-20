function makeCanvas(w, h) {
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: canvas.getContext("2d") };
}


function testUnits() {
	player = Player(10, 10, Player.modes.LOCAL);
	ai = Player(20, 10, Player.modes.AI);
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

