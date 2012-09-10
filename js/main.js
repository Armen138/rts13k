function makeCanvas(w, h) {
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return { canvas : canvas, context: canvas.getContext("2d") };
}

function startGame(difficulty) {	
	game.init(difficulty);
	game.players.push(Player(10, 10, Player.modes.LOCAL));
	game.players.push(Player(100, 100, Player.modes.AI));
	game.run();

}

var menu = {
	click: function(id, func) {
	document.getElementById(id).addEventListener('click', func);
	},
	hide: function(id) {
		document.getElementById(id).style.display = 'none';
	},
	show: function(id) {
		document.getElementById(id).style.display = 'block';	
	}
};

window.addEventListener("load", function() {
	menu.click('play', function() {
		menu.show('difficulty');
	});
	menu.click('help', function() {
		menu.show('shortcuts');
	});	
	menu.click('easy', function() {
		menu.hide('menu');
		startGame(0);
	});
	menu.click('medium', function() {
		menu.hide('menu');
		startGame(1);
	});	
	menu.click('hard', function() {
		menu.hide('menu');
		startGame(2);
	});	
	menu.click('shortcuts', function() {
		menu.hide('shortcuts');
	});
});

