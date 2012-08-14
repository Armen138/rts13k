

function makeCanvas(w, h) {
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: canvas.getContext("2d") };
}


function testUnits() {
	for( var i = 0; i < 13; i++) {
		game.addUnit(10 + i, 10, "#3A3");
	}

	for( var i = 0; i < 13; i++) {
		game.addUnit(10 + i, 15, "#A33");
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

