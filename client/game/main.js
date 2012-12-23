
/* quick + dirty image preloader */
window.qdip = {
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
					console.log("failed to load: " + file);
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
/*
window.addEventListener("load", function() {
	qdip.on("load", function() {
		menu.click('connect', function() {
			menu.hide('menu');
			//game.connect("ws://armen138.server.jit.su");
			loadTiles();
			game.connect("ws://13t.dev138.info:8080");
			//game.connect("ws://hq138.info:8080");
		});

	});
	qdip.load({
		"terrain": "images/terrain32.png",
		"tankbody": "images/tankbody.png",
		"cannon1": "images/cannon1_1.png",
		"cannon2": "images/cannon2.png",
		"powerplant": "images/power_plant.png",
		"powerplant_active": "images/power_plant_glow.png",
		"turretbody": "images/turretbody.png",
		"turretcannon": "images/turretcannon.png",
		"mine": "images/resource_gatherer.png"
	});
	menu.click('help', function() {
		menu.show('shortcuts');
	});
	menu.click('shortcuts', function() {
		menu.hide('shortcuts');
	});
});*/

