cat js/art.js js/definitions.js js/pathfinder.js js/events.js js/nodes.js js/basictypes.js js/tilesystem.js js/simplex.js js/procedural.js	js/gameview.js	js/bullet.js js/unit.js js/ui.js js/game.js js/ai.js js/player.js js/main.js | uglifyjs -o bin/js/rts13k.js
cat js/astar.js | uglifyjs -o bin/js/astar.js
zip -r rts13k.zip bin		