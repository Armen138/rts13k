function makeCanvas(w, h) {
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: canvas.getContext("2d") };
}


function testUnits() {
	game.players.push(Player(10, 10, Player.modes.LOCAL));
	game.players.push(Player(100, 100, Player.modes.AI));
}

if(!navigator.isCocoonJS) {
	setInterval(function() {
		game.fps = game.frames;
	    document.getElementById("fps").innerHTML = game.fps;
		game.frames = 0;
	}, 1000);
}

window.addEventListener("load", function() {
	document.getElementById('fps').style.display = "none";
	document.addEventListener("keyup", function(e) {
		if(e.keyCode == 13) {
			document.getElementById('fps').style.display = "block";		
		}
	});
	
	game.init();
	testUnits();
	game.run();
});

