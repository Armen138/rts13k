/* unitObject:
	{
		mobile: bool,
		health: int,
		art: Function (see art object),
		optional loadTime: int,
		optional damage: int,
		optional range: int (tiles),
		optional upkeep: int (energy),
		optional moveDuration: int (ms)
	}
*/
var Unit = function(tx, ty, tc, unitObject) {
	var x = tx * tileSize,
		y = ty * tileSize,
		angle = 0,
		cannonAngle = 0,
		color = tc,
		fireTime = 0,
		kills = 0,
		incomeTime = 0,
		health = unitObject.health || 100,
		loadTime = unitObject.loadTime || null,
		mode = Unit.GUARD,
		collider = unitObject.collision || collision.UNIT,
		moveDuration = unitObject.moveDuration || 100,
		path = [],
		range = unitObject.range || 5,
		selected = false,
		tileTime = 0,
		setTile = function(ntx, nty, collide) {
			//if(collide)game.collisionMap[tx][ty] = collision.PASSABLE;
			tx = ntx;
			ty = nty;
			x = ntx * tileSize;
			y = nty * tileSize;
			if(collide) {
				if(game.collisionMap[tx][ty] === collider) {
					console.log("collision, evading.");
					unit.go(game.spiral(2, {X: tx, Y: ty})[1], true);
				} else {
					game.collisionMap[tx][ty] = collider;
				}
			}
		},
		followPath = function(foundPath) {
			path = foundPath;
			tileTime = (new Date()).getTime();
			if(path.length === 0) {
				console.log("no path!");
			}
		},
		unit = {
			mobile: unitObject.mobile,
			target: {X: 0, Y: 0},
			art: unitObject.art,
			badge: "",
			team: 0,
			factory: unitObject.factory,
			select: function() {
				selected = true;
			},
			deselect: function() {
				selected = false;
			},
			draw: function() {
				unitObject.art(x, y, color.toString(), selected ? "yellow" : "black", angle, cannonAngle);
				if(unit.badge !== "") {				
					game.context.fillStyle = "black";
					game.context.font = "10px Arial Unicode MS, Arial";
					game.context.textAlign = "left";					
					game.context.fillText(unit.badge ,  x - game.map.offset.X * tileSize, y - game.map.offset.Y * tileSize);					
				}
				this.update();
			},
			hit: function(damage) {
				health -= damage;
				if(health < 0) {
					unit.dead = true;
					unit.owner.deaths++;
					game.collisionMap[tx][ty] = collision.PASSABLE;
					if(unitObject.big) {
						game.collisionMap[tx][ty + 1] = collision.PASSABLE;
						game.collisionMap[tx + 1][ty] = collision.PASSABLE;
						game.collisionMap[tx + 1][ty + 1] = collision.PASSABLE;
					}
					return true;
				}
				return false;
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
				if(unitObject.mobile) {
					if(game.collisionMap[dest.X][dest.Y] === collision.PASSABLE) {
						if(!evading) game.collisionMap[tx][ty] = collision.PASSABLE;
						//game.collisionMap[dest.X][dest.Y] = collision.RESERVED;
						//pathFinder.postMessage({ collisionMap: game.collisionMap, x1: tx, y1: ty, x2: dest.X, y2: dest.Y });
						pathFinder.find({X: tx, Y: ty}, dest, followPath);
					} else {
						console.log("sir no sir, destination is: " + game.collisionMap[dest.X][dest.Y]);
					}
				} else {
					unit.rallyPoint = dest;
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
				if (unit.owner.energy < 0 && !unitObject.mobile) {
					unit.badge = "⚡";
				} else {
					unit.badge = "" + (unit.team > 0 ? unit.team : "");
				}
				if(unitObject.income) {
					var now = (new Date()).getTime();
					if(now - incomeTime > 1000 && unit.owner.energy > 0) {
						unit.owner.credits += unitObject.income;
						incomeTime = now;
					}
				}
				if(unitObject.mobile) {
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
							angle = Math.atan2((path[0].X - tx), (ty - path[0].Y));
						}
					}
				}
				if(unitObject.loadTime && !(!unitObject.mobile && unit.owner.energy < 0)) {
					rangeBox = [x - range * tileSize, y - range * tileSize, range * 2 * tileSize, range * 2 * tileSize];
					unit.target = { X: 0, Y: 0};
					game.units.each(function() {
						if(this.owner.id !== unit.owner.id && this.isInside(rangeBox, true)) {
							unit.target = this.position;
						}
					});
					var now = (new Date()).getTime();
					//aim cannon
					if(unit.target.X !== 0 && unit.target.Y !== 0) {
						cannonAngle = Math.atan2((unit.target.X - x), (y - unit.target.Y) );
						if(now - fireTime > loadTime) {
							var b = Bullet({X: x, Y: y}, unit.target, unitObject.damage || 10);
							b.owner = unit;
							game.root.add(b);
							fireTime = now;
						}
					} else {
						cannonAngle = 0;
					}
				}
			},
			kill: function() {
				kills++;
				unit.owner.kills++;
			}
		};
	Object.defineProperty( unit, "position", { get: function() { return { X: x,  Y: y}; }});
	Object.defineProperty( unit, "tile", { get: function() { return { X: tx,  Y: ty}; }});
	Object.defineProperty( unit, "percent", { get: function() { return health / unitObject.health; }});
	Object.defineProperty( unit, "kills", {
		get: function() { return kills;}
	});
	game.collisionMap[tx][ty] = collider;
	if(unitObject.big) {
		game.collisionMap[tx][ty + 1] = collider;
		game.collisionMap[tx + 1][ty] = collider;
		game.collisionMap[tx + 1][ty + 1] = collider;
	}
	Events.attach(unit);
	return unit;
};

//enum unit modes.
//Fire when enemy is in range, do not chase
Unit.GUARD = 0; 
// Move into range to attack nearby enemies
Unit.AGRESSIVE = 1; 
// Do not fire on anything ever
Unit.CEASEFIRE = 0; 