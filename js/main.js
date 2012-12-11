
/* quick + dirty image preloader */
qdip = {
	total: 0,
	loaded: 0,
	images: {},
	load: function(files) {
		function loaded(file) {
			qdip.loaded++;
			qdip.fire("progress", file);
			if(qdip.loaded === qdip.total) {
				qdip.fire("load");
			}
		}
		for(var file in files) {
			qdip.total++;
			var img = new Image();
			(function(img, file){
				img.onload = function() {
					loaded(file);
				};
				img.onerror = function() {
					//fail silently.
					loaded(file);
				};
			}(img, file));
			img.src = files[file];
			qdip.images[file] = img;
		}
	}
};
Events.attach(qdip);
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
	qdip.on("load", function() {
		menu.click('connect', function() {
			menu.hide('menu');
			//menu.show('logbook');
			//game.connect("ws://armen138.server.jit.su");
			//game.connect("ws://localhost:8080");
			game.connect("ws://hq138.info:8080");
		});		

	});
	qdip.load({
		"terrain": "images/terrain32.png",
		"mine": "images/mine32.png"
	});
	/*menu.click('play', function() {
		menu.show('difficulty');
	});*/
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

