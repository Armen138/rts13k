var ui = {
	topline: 30,
	draw: function() {
		game.context.save();
		game.context.lineWidth = 4;
		game.context.fillStyle = "yellow";
		game.context.strokeStyle = "black";
		game.context.font = "30px Arial";
		game.context.strokeText("⚡", 20, ui.topline);
		game.context.fillText("⚡",  20, ui.topline);

		game.context.font = "30px Arial";
		
		game.context.strokeText("$", 20, ui.topline + 40);
		game.context.fillText("$",  20, ui.topline + 40);

		game.context.fillStyle = "black";
		game.context.font = "16px Arial";
		game.context.fillText("100/150", 50, ui.topline);
		game.context.fillText("500", 50, ui.topline + 40);

		game.context.restore();
	}
}