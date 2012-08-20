Unit = function(tx, ty, tc) {
	var x = tx * tileSize,
		y = ty * tileSize,
		color = tc,
		path = [],
		range = 5,
		health = 100,
		angle = 0,
		tileTime = 0,
		selected = false,
		moveDuration = 100,
		mode = Unit.GUARD,
		getAngle = function(x1, y1, x2, y2) {
			var diff = bt.Vector(x1 - x2, y1 - y2);
			if(diff.X < 0 && diff.Y < 0){ return 3 * Math.PI / 4; }
			if(diff.X === 0 && diff.Y < 0){ return Math.PI; }
			if(diff.X > 0 && diff.Y < 0){ return Math.PI / 4; }
			if(diff.X < 0 && diff.Y === 0){ return Math.PI / 2; }
			if(diff.X > 0 && diff.Y === 0){ return 3 * Math.PI / 2; }
			if(diff.X < 0 && diff.Y > 0){ return 5 * Math.PI / 4; }
			if(diff.X === 0 && diff.Y > 0){ return 0; }
			if(diff.X > 0 && diff.Y > 0){ return 7 * Math.PI / 4; }
			return 0;
		},
		setTile = function(ntx, nty, collide) {
			//if(collide)game.collisionMap[tx][ty] = collision.PASSABLE;
			tx = ntx;
			ty = nty;
			x = ntx * tileSize;
			y = nty * tileSize;
			if(collide) {
				if(game.collisionMap[tx][ty] === collision.UNIT) {
					console.log("collision, evading.");
					unit.go(game.spiral(2, {X: tx, Y: ty})[1], true);
				} else {
					game.collisionMap[tx][ty] = collision.UNIT;
				}
			}
		},
		followPath = function(foundPath) {
			path = foundPath;
			tileTime = (new Date()).getTime();
			if(path.length === 0) {
				console.log("no path!");
			} else {
				console.log("path");
			}
		};
	game.collisionMap[tx][ty] = collision.UNIT;

	var cannonAngle = 0;
	var unit = {
		get position() {
			return {X: x, Y: y};
		},
		target: {X: 0, Y: 0},
		select: function() {
			selected = true;
		},
		deselect: function() {
			selected = false;
		},
		draw: function() {
			game.context.save();
			game.context.fillStyle = color.toString();
			game.context.strokeStyle = selected ? "yellow" : "black";
			game.context.translate(x - game.map.offset.X * tileSize + tileSize / 2, y - game.map.offset.Y * tileSize + tileSize / 2);
			game.context.rotate(angle);
			game.context.fillRect(-8, -16, 16, 32);
			game.context.strokeRect(-8, -16, 16, 32);

			//cannon
			game.context.rotate(-angle);			
			game.context.rotate(cannonAngle);

			game.context.fillRect(-2, -16, 4, 24);
			game.context.strokeRect(-2, -16, 4, 24);
			game.context.fillRect(-5, -5, 10, 10);
			game.context.strokeRect(-5, -5, 10, 10);						
			game.context.restore();
			this.update();
		},
		isInside: function(rect, noffset) {
			var ox = game.map.offset.X * tileSize, oy = game.map.offset.Y * tileSize;
			if(noffset) {
				ox = 0; oy = 0;
			}
			return (x > rect[0] + ox && x < rect[0] + ox + rect[2] && y > rect[1] + oy && y < rect[1] + oy + rect[3]);
		},
		go: function(dest, evading) {
			/*if(path.length > 0) {
				game.collisionMap[path[path.length - 1].X][path[path.length - 1].Y] = collision.PASSABLE;
			}*/
			if(game.collisionMap[dest.X][dest.Y] === collision.PASSABLE) {
				if(!evading) game.collisionMap[tx][ty] = collision.PASSABLE;
				//game.collisionMap[dest.X][dest.Y] = collision.RESERVED;
				//pathFinder.postMessage({ collisionMap: game.collisionMap, x1: tx, y1: ty, x2: dest.X, y2: dest.Y });
				pathFinder.find({X: tx, Y: ty}, dest, followPath);
			} else {
				console.log("sir no sir, destination is: " + game.collisionMap[dest.X][dest.Y]);
			}
		},
		click: function(clickx, clicky) {
			var sx = x - game.map.offset.X * tileSize,
				sy = y - game.map.offset.Y * tileSize;
			if( clickx > sx - 16 &&
				clickx <  sx + 16 &&
				clicky > sy - 16 &&
				clicky < sy + 16) {
				unit.fire("click");
				return true;
			}
			return false;
		},
		update: function() {
			if(path.length > 0) {
				curTime = (new Date()).getTime() - tileTime;
				if(curTime > moveDuration) {
					var to = path.shift();
					setTile(to.X, to.Y, path.length === 0);
					tileTime = (new Date()).getTime();
				}
				else {
					var xdest = path[0].X * tileSize,
						ydest = path[0].Y * tileSize,
						xtarg = tx * tileSize,
						ytarg = ty * tileSize,
						xdiff = xdest - xtarg,
						ydiff = ydest - ytarg,
						fract = parseFloat(curTime) / parseFloat(moveDuration);
					x = xtarg + (fract * xdiff) | 0;
					y = ytarg + (fract * ydiff) | 0;
					angle = getAngle(xdest, ydest, xtarg, ytarg);
				}
			}
			rangeBox = [x - range * tileSize, y - range * tileSize, range * 2 * tileSize, range * 2 * tileSize];
			game.units.each(function() {
				if(this.owner.id !== unit.owner.id && this.isInside(rangeBox, true)) {
					unit.target = this.position;
				}
			});
			//aim cannon
			if(unit.target.X !== 0 && unit.target.Y !== 0) {
				cannonAngle = Math.atan2((unit.target.X - x), (y - unit.target.Y) );
			} else {
				cannonAngle = 0;
			}
		}
	}
	Events.attach(unit);
	return unit;
};

//enum unit modes.
Unit.GUARD = 0; //Fire when enemy is in range, do not chase
Unit.AGRESSIVE = 1; // Move into range to attack nearby enemies
Unit.CEASEFIRE = 0; // Do not fire on anything ever