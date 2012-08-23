var ui = {
	topline: 30,
	minimapImage: null,
	minimapUnits: (function(){
		var canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		return {canvas: canvas, context: canvas.getContext('2d') };
	}()),
	draw: function() {
		var player = game.players[0];
		game.context.save();
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
		game.context.globalAlpha = 0.5;
		game.context.drawImage(ui.minimapImage, 16, game.canvas.height - 144);
		game.context.globalAlpha = 1.0;
		game.context.drawImage(ui.minimapUnits.canvas, 16, game.canvas.height - 144);
	}
};