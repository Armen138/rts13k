require(["resources", "canvas", "game"], function(Resources, Canvas, Game) {
	if(!localStorage.server) {
		console.log("don't know which server to join.");
	}

	Resources.on("load", function() {
		//connect to server.
		var game = Game(localStorage.server);
	});

	Canvas.context.textAlign = "center";
	Canvas.context.fillStyle = "white";
	Canvas.context.font = "50px Arial, sans-serif";
	Canvas.context.fillText("Loading", 512, 384);
	Resources.load({
		//"terrain": "images/terrain32.png",
		"tile1": "images/tile1.png",
		"tile2": "images/tile2.png",
		"element1": "images/element1.png",
		"tankbody": "images/tankbody.png",
		"tankbody2": "images/tankbody2.png",
		"cannon1": "images/cannon1_1.png",
		"cannon2": "images/cannon2.png",
		"powerplant": "images/power_plant.png",
		"powerplant_active": "images/power_plant_glow.png",
		"turretbody": "images/turretbody.png",
		"turretcannon": "images/turretcannon.png",
		"mine": "images/mine.png",
		"button64": "images/button64.png",
		"hud": "images/hud_layout.png",
		"hudborder": "images/hudborder.png",
		"factory": "images/factory.png"		
	});
});