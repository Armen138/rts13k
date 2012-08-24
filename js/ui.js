var ui = {
	topline: 30,
	minimapImage: null,
	hudPosition: {X: 10, Y: 10},
	hudSize: {W: 512, H: 160},
	minimapUnits: (function(){
		var canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		return {canvas: canvas, context: canvas.getContext('2d') };
	}()),
	draw: function() {
		ui.hud();
		ui.stats();
		ui.minimap();
	},
	stats: function() {
		var player = game.players[0];
		game.context.save();
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);		
		game.context.lineWidth = 4;
		game.context.fillStyle = "yellow";
		game.context.strokeStyle = "black";
		game.context.font = "30px Arial Unicode MS, Arial";
		game.context.strokeText("⚡", 20, ui.topline);
		game.context.fillText("⚡",  20, ui.topline);
				
		game.context.strokeText("$", 20, ui.topline + 40);
		game.context.fillText("$",  20, ui.topline + 40);

		game.context.font = "20px Arial Unicode MS, Arial";
		game.context.strokeText("⚔", 20, ui.topline + 80);
		game.context.fillText("⚔",  20, ui.topline + 80);


		game.context.fillStyle = "black";
		game.context.font = "16px Arial Unicode MS, Arial";
		game.context.fillText(player.energy + "/" + player.energyMax, 50, ui.topline);
		game.context.fillText(player.credits, 50, ui.topline + 40);
		game.context.fillText(player.kills + "/" + player.deaths, 50, ui.topline + 80);

		game.context.restore();
	},
	hud: function() {
		game.context.save();
		game.context.fillStyle = "grey";
		game.context.strokeStyle = "black";		
		game.context.lineWidth = 4;
		game.context.translate(ui.hudPosition.X, ui.hudPosition.Y);
		game.context.fillRect(0, 0, ui.hudSize.W, ui.hudSize.H);
		game.context.strokeRect(0, 0, ui.hudSize.W, ui.hudSize.H);
		game.context.restore();
	},
	minimap: function() {
		if(!ui.minimapImage) {
			ui.minimapImage = game.map.drawMini();
		}
		ui.minimapUnits.context.clearRect(0, 0, 128, 128);
		game.units.each(function() {
			if(this.owner === game.players[0]) {
				ui.minimapUnits.context.fillStyle = "#7eff15";
				ui.minimapUnits.context.fillRect(this.tile.X, this.tile.Y, 2, 2);
			}
		});
		ui.minimapUnits.context.strokeRect(game.map.offset.X, game.map.offset.Y, game.canvas.width / tileSize, game.canvas.height / tileSize);
		game.context.globalAlpha = 0.5;
		game.context.drawImage(ui.minimapImage, ui.hudPosition.X + 368, ui.hudPosition.Y + 16);
		game.context.globalAlpha = 1.0;
		game.context.drawImage(ui.minimapUnits.canvas, ui.hudPosition.X + 368, ui.hudPosition.Y + 16);
	},
	click: function(x, y) {
		console.log({X: x, Y: y});
	}
};