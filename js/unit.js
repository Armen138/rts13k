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
var Unit = function(tx, ty, tc, unitObject, id) {
    var x = tx * tileSize,
        y = ty * tileSize,
        angle = 0,
        cannonAngle = 0,
        color = tc,
        fireTime = 0,
        kills = 0,
        incomeTime = 0,
        //health = unitObject.health || 100,
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
                    unit.go(game.spiral(2, {X: tx, Y: ty})[1], true);
                    return true;
                } else {
                    game.collisionMap[tx][ty] = collider;
                }
            }
            return false;
        },
        followPath = function(foundPath) {
            path = foundPath;
            tileTime = (new Date()).getTime();
            if(path.length === 0) {
                console.log("no path!");
            }
        },
        unit = {
            health: unitObject.health || 100,
            mobile: unitObject.mobile,
            target: null,
            targetUnit: null,
            art: unitObject.art,
            name: unitObject.name,
            badge: "",
            team: 0,
            dead: false,
            builds: unitObject.builds,
            factory: unitObject.factory,
            id: id,
            get spec() {
                return unitObject;
            },
            get idle() {
                return  path.length === 0 &&
                        !unit.target;
            },
            setPath: function(newPath) {
                followPath(newPath);
            },
            select: function() {
                selected = true;
            },
            deselect: function() {
                selected = false;
            },
            buttons: function() {
                var buttons;
                if(unit.builds) {
                    buttons = [];
                    for(var i = 0; i < unit.builds.length; i++) {
                        (function(build){
                            buttons.push({
                                image: function(x, y) {
                                    var color = game.players[0].credits > build.cost ? "gray" : "red";
                                    build.art(x, y, color, "black", 0, 0, true);
                                },
                                action: function() {
                                    var p = game.spiral(1, unit.tile)[0];
                                    var rallyPoint = game.spiral(1, unit.rallyPoint || unit.tile)[0];
                                    network.build(p, build, rallyPoint);
                                },
                                badge: "$" + build.cost,
                                id: unit.id
                            });
                        }(def[unit.builds[i]]));
                    }
                } else {
                    buttons = [{
                        image: function(x, y) {
                            if(!unit.dead) {
                                var c = bt.Color("#0F0");
                                c.red = (1.0 - unit.percent) * 255 | 0;
                                c.green = (unit.percent) * 255 | 0;
                                var color = c.toString();
                                unit.art(x, y, color, "black", 0, 0, true);
                            }
                        },
                        action: function() {
                            game.deselectAll();
                            game.selectedUnits.add(unit);
                            unit.select();
                            game.hud.buttons = game.hud.SmallButtons([unit.buttons()[0]]);
                        },
                        badge: unit.hp,
                        tooltip: unit.hp,
                        id: unit.id
                    }];
                }
                if(!unit.mobile) {
                    buttons.push({
                        image: function(x, y) {
                            art.sell(x, y, "green", "black", 0, 0, true);
                        },
                        action: function() {
                           game.deselectAll();
                           game.sell(unit);
                        }
                    });
                }
                return buttons;
            },
            draw: function() {
                unitObject.art(x + gameView.offset.X, y + gameView.offset.Y, color.toString(), selected ? "yellow" : "black", angle, cannonAngle);
                if(unit.badge !== "") {
                    game.context.fillStyle = "black";
                    game.context.font = "10px Dejavu Sans, Arial";
                    game.context.textAlign = "left";
                    game.context.fillText(unit.badge ,  x + gameView.offset.X - game.map.offset.X * tileSize, y  + gameView.offset.X - game.map.offset.Y * tileSize);
                }
                this.update();
            },
            die: function() {
                if(!unit.dead) {
                    unit.dead = true;
                    unit.owner.deaths++;
                    //if(unitObject.upkeep) { unit.owner.energy -= unitObject.upkeep };
                    game.collisionMap[tx][ty] = collision.PASSABLE;
                    if(unitObject.big) {
                        game.collisionMap[tx][ty + 1] = collision.PASSABLE;
                        game.collisionMap[tx + 1][ty] = collision.PASSABLE;
                        game.collisionMap[tx + 1][ty + 1] = collision.PASSABLE;
                    }
                    if(unit.ondeath) { unit.ondeath(unitObject); }
                }
            },
            hit: function(damage) {
                /*unit.health -= damage;
                if(!unit.dead && health < 0) {
                    unit.die();
                    return true;
                }
                return false;*/
            },
            isInside: function(rect, noffset) {
                var ox = game.map.offset.X * tileSize - gameView.offset.X, oy = game.map.offset.Y * tileSize - gameView.offset.Y;
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
                    network.request({"type" : "unit-go", "X" : dest.X, "Y": dest.Y, "id": unit.id});
                    /*if(game.collisionMap[dest.X][dest.Y] !== collision.PASSABLE) {
                        dest = game.spiral(1, dest)[0];
                    }
                    if(game.collisionMap[dest.X][dest.Y] === collision.PASSABLE) {
                        if(!evading) game.collisionMap[tx][ty] = collision.PASSABLE;
                        pathFinder.find({X: tx, Y: ty}, dest, followPath);
                    }*/
                } else {
                    unit.rallyPoint = dest;
                }
            },
            click: function(clickx, clicky) {
                var sx = x - game.map.offset.X * tileSize,
                    sy = y - game.map.offset.Y * tileSize,
                    unitSize = unitObject.big ? 64 : 32;
                if( clickx > sx &&
                    clickx < sx + unitSize &&
                    clicky > sy &&
                    clicky < sy + unitSize) {
                    unit.fire("click");
                    return true;
                }
                return false;
            },
            syncPosition: function(pos) {
                setTile(pos.X, pos.Y);
            },
            update: function() {

                if (unit.owner.energy < 0 && !unitObject.mobile) {
                    unit.badge = "⚡";
                } else {
                    unit.badge = "" + (unit.team > 0 ? unit.team : "");
                }
                if(unitObject.income) {
                    var now = (new Date()).getTime();
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
                            
                                /*if(path.length > 0) {
                                    if(game.collisionMap[path[0].X][path[0].Y] === collision.STRUCTURE) {
                                        unit.go(path[path.length -1]);
                                    }
                                }*/
                            
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
                    } else {
                        if(unit.targetUnit && !unit.targetUnit.dead && bt.Vec.distance(unit.targetUnit.tile, unit.tile) > range) {
                            var to = game.spiral(1, unit.targetUnit.tile)[0];
                            unit.go(to);
                        }
                    }
                }
                if(unitObject.loadTime && !(!unitObject.mobile && unit.owner.energy < 0)) {
                    //rangeBox = [x - range * tileSize, y - range * tileSize, range * 2 * tileSize, range * 2 * tileSize];
                    //unit.target = null;
                    /*game.units.each(function() {
                        if(this.owner.id !== unit.owner.id && this.isInside(rangeBox, true)) {
                            unit.target = this.position;
                        }
                    });*/
                    var now = (new Date()).getTime();
                    //aim cannon
                    if(unit.target) { //&& !isNaN(unit.target.X) && !isNaN(unit.target.Y)) {                        
                        cannonAngle = Math.atan2((unit.target.position.X - x), (y - unit.target.position.Y) );
                        if(now - fireTime > loadTime) {
                            var b = Bullet({X: x, Y: y}, unit.target.position, unitObject.damage || 10);
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
    Object.defineProperty( unit, "percent", { get: function() { return unit.health / unitObject.health; }});
    Object.defineProperty( unit, "kills", {
        get: function() { return kills;}
    });
    console.log(tx + ", " + ty);
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