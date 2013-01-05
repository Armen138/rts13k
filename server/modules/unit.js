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
var unitId = 1;
var tileSize = 32;
var Events = require('./events.js'),
    Message = require('./message.js').Message,
    collision = require('./collision.js'),
    astar = require('./astar.js'),
    bt = require('./basictypes.js');
//console.log(collision.PASSABLE);
exports.Unit = function(tx, ty, unitObject, game) {
    var x = tx,
        y = ty,
        lastTarget = null,
        angle = 0,
        cannonAngle = 0,
        fireTime = 0,
        kills = 0,
        incomeTime = 0,
        health = unitObject.health || 100,
        loadTime = unitObject.loadTime || null,
        //mode = Unit.GUARD,
        collider = unitObject.collision,// || collision.UNIT,
        moveDuration = unitObject.moveDuration || 100,
        path = [],
        range = unitObject.range || 5,
        selected = false,
        tileTime = 0,
        setTile = function(ntx, nty, collide) {
            game.collisionMap[tx][ty] = collision.PASSABLE;
            tx = ntx;
            ty = nty;
            x = ntx * tileSize;
            y = nty * tileSize;
            if(game.collisionMap[tx][ty] > 0) {
                var u = game.getUnit(unit.owner, game.collisionMap[tx][ty]);
                if(u && (u.owner !== unit.owner || !u.mobile) || collide) {
                    unit.go(game.spiral(2, {X: tx, Y: ty})[1], true);
                    return true;
                }

            } else {
                game.collisionMap[tx][ty] = unit.id;
            }
            return false;
        },
        followPath = function(foundPath) {
            path = foundPath;
            tileTime = (new Date()).getTime();
            if(path.length === 0) {
                //console.log("no path!");
            } else {
                unit.fire("path", path);
            }
        },
        unit = {
            id: unitId++,
            mobile: unitObject.mobile,
            target: null,
            targetUnit: null,
            art: unitObject.art,
            name: unitObject.name,
            badge: "",
            team: 0,
            dead: false,
            cost: unitObject.cost,
            factory: unitObject.factory,
            get spec() {
                return unitObject;
            },
            get serialized() {
                return {
                    name: unitObject.name,
                    health: health,
                    position: {X: tx, Y: ty},
                    owner: unit.owner.id,
                    id: unit.id,
                    path: path
                };
            },
            toString: function() {
                return JSON.stringify(unit.serialized);
            },
            get idle() {
                return  path.length === 0 &&
                        !unit.target;
            },
            get health() {
                return health;
            },
            select: function() {
                selected = true;
            },
            deselect: function() {
                selected = false;
            },
            die: function() {
                if(!unit.dead) {
                    unit.dead = true;
                    unit.owner.deaths++;
                    if(unitObject.upkeep) { unit.owner.energy -= unitObject.upkeep; }
                    game.collisionMap[tx][ty] = collision.PASSABLE;
                    if(unitObject.big) {
                        game.collisionMap[tx][ty + 1] = collision.PASSABLE;
                        game.collisionMap[tx + 1][ty] = collision.PASSABLE;
                        game.collisionMap[tx + 1][ty + 1] = collision.PASSABLE;
                    }
                    unit.fire("death");
                    if(unit.ondeath) { unit.ondeath(unitObject); }
                }
            },
            hit: function(damage) {
                health -= damage;
                unit.fire("health", health);
                if(!unit.dead && health < 0) {
                    unit.die();
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
            attack: function(target) {
                unit.targetUnit = target;
            },
            go: function(dest, evading) {
                if(unitObject.mobile) {
                    if(game.collisionMap[dest.X][dest.Y] !== collision.PASSABLE) {
                        dest = game.spiral(1, dest)[0];
                    }
                    if(game.collisionMap[dest.X][dest.Y] === collision.PASSABLE) {
                        if(!evading) {
                            game.collisionMap[tx][ty] = collision.PASSABLE;
                            game.unitMap[tx][ty] = null;

                            //unit.to = dest;
                        }
                        var time = (new Date()).getTime();
                        var path = astar.findPath(game.collisionMap, {X: tx, Y: ty}, dest);
                        var pathTime = (new Date()).getTime() - time;
                        if(pathTime > 100) {
                            console.log("finding path took " + pathTime + "ms");
                        }
                        if(path.length === 0) {
                            setTimeout(function() {
                                unit.go(dest, evading);
                            }, 50);
                        }
                        followPath(path);
                        return path;
                        //pathFinder.find({X: tx, Y: ty}, dest, followPath);
                    }
                } else {
                    unit.rallyPoint = dest;
                }
            },
            update: function() {
                var now = (new Date()).getTime();
                game.collisionMap[tx][ty] = unit.id;
                if(unit.dead) {
                    console.log("ghost unit");
                }
                var update = null;
                if (unit.owner.energy < 0 && !unitObject.mobile) {
                    unit.badge = "⚡";
                } else {
                    unit.badge = "" + (unit.team > 0 ? unit.team : "");
                }
                if(unitObject.income) {
                    if(now - incomeTime > 1000 && unit.owner.energy >= 0) {
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

                            if(path.length > 0) {
                                if(game.collisionMap[path[0].X][path[0].Y] === collision.STRUCTURE) {
                                    unit.go(path[path.length -1]);
                                    unit.fire("path", path);
                                }
                            } else {
                                if(unit.to && !bt.Vec.equal(unit.to, to)) {
                                    unit.go(unit.to);
                                } else {
                                    unit.to = null;
                                    unit.fire("position", { position: to, path: path });
                                }
                            }

                        }
                         /*else {
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
                        }*/
                    } else {
                        if(unit.targetUnit && !unit.targetUnit.dead && bt.Vec.distance(unit.targetUnit.tile, unit.tile) > range) {
                            var to = game.spiral(1, unit.targetUnit.tile)[0];
                            unit.go(to);
                            unit.fire("path", path);
                        }
                    }
                }
                if(unitObject.loadTime && !(!unitObject.mobile && unit.owner.energy < 0)) {
                    //rangeBox = [x - range * tileSize, y - range * tileSize, range * 2 * tileSize, range * 2 * tileSize];
                    //unit.target = null;
                    //need to link units to their map coordinates for targeting to avoid looping every frame
                    var target;
                    if(lastTarget && !lastTarget.dead && bt.Vec.distance(unit.position, lastTarget.position) < range) {
                        target = lastTarget;
                    } else {
                        target = game.getClosestUnit(unit.position, unit.owner.id, range);
                        //debug
                        /*
                        if(target !== null) {
                            var dist = bt.Vec.distance(target.position, unit.position);
                            if(dist > range) {
                                console.log("targetting bugged: claims to be within range " + range + ", but is at distance " + dist);
                            }
                        }*/
                    }

                    if(target !== lastTarget) {
                        unit.target = target;
                        unit.fire("target", target);
                        lastTarget = target;
                    }
                    /*game.units.each(function() {
                        if(this.owner.id !== unit.owner.id && this.isInside(rangeBox, true)) {
                            unit.target = this.position;
                        }
                    });*/
                    //aim cannon
                    if(unit.target) {
                        if(now - fireTime > loadTime) {
                        /*  var b = Bullet({X: x, Y: y}, unit.target, unitObject.damage || 10);
                            b.owner = unit;
                            game.root.add(b);*/
                            (function(start, end, damage) {
                                var delay = bt.Vec.distance(start, end) * 100;
                                setTimeout(function() {
                                    var u = game.collisionMap[end.X][end.Y];
                                    if(u > 0) {
                                        u = game.getUnit(null, u);
                                        if(u) {
                                            u.hit(damage);
                                        }
                                    }
                                    //this is a backup solution in case the collisionmap fails to find the right unit
                                    if(unit.target) {
                                        if (unit.target.position.X === end.X &&
                                            unit.target.position.Y === end.Y) {
                                            unit.target.hit(damage);
                                        }
                                    }
                                }, delay);
                            }({X: tx, Y: ty}, unit.target.position, unitObject.damage || 10));
                            fireTime = now;
                        }
                    }
                }
                return update;
            },
            kill: function() {
                kills++;
                unit.owner.kills++;
            }
        };
    Object.defineProperty( unit, "position", { get: function() { return { X: tx,  Y: ty}; }});
    Object.defineProperty( unit, "tile", { get: function() { return { X: tx,  Y: ty}; }});
    Object.defineProperty( unit, "percent", { get: function() { return health / unitObject.health; }});
    Object.defineProperty( unit, "kills", {
        get: function() { return kills;}
    });

    game.collisionMap[tx][ty] = unit.id;
    if(unitObject.shape) {
        for(var px = 0; px < unitObject.shape.length; px++) {
            for(var py = 0; py < unitObject.shape[0].length; py++) {
                if(unitObject.shape[px][py] === 1) {
                    game.collisionMap[tx + px][ty + py] = unit.id;
                }
            }
        }
    } else {
        if(unitObject.big) {
            game.collisionMap[tx][ty + 1] = unit.id;
            game.collisionMap[tx + 1][ty] = unit.id;
            game.collisionMap[tx + 1][ty + 1] = unit.id;
        }
    }
    Events.attach(unit);
    return unit;
};
/*
//enum unit modes.
//Fire when enemy is in range, do not chase
Unit.GUARD = 0;
// Move into range to attack nearby enemies
Unit.AGRESSIVE = 1;
// Do not fire on anything ever
Unit.CEASEFIRE = 0;
*/