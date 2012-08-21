var Bullet = function(from, to, damage) {
	var x = from.X,
		y = from.Y,
		distance = bt.Vector(x, y).distanceTo(to),
		travelTime = distance / tileSize * 100,
		fractX = (to.X - from.X) / travelTime,
		fractY = (to.Y - from.Y) / travelTime,
		fired = (new Date()).getTime(),
		bullet = {
			draw: function() {
				game.context.save();
				game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
				game.context.fillStyle = "#FF0000";			
				game.context.fillRect(-2, -2, 4, 4);
				game.context.restore();
				bullet.update();
			},
			update: function() {
				d = (new Date).getTime() - fired;

				x = from.X + fractX * d;
				y = from.Y + fractY * d;
				if(d > travelTime) {
					game.root.remove(bullet);
				}
			}
		};
	return bullet;
}