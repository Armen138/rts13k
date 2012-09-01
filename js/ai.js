var AI = function(player) {
	return {
		update: function() {
			if(player.units) {
				player.units.each(function() {
					if(this.idle) {
						var p = game.spiral(1, {X: 10, Y: 10});
						this.go(p[0]);
					}
				});
			}
		}
	};
};