cd js
cat pathfinder.js events.js nodes.js basictypes.js simplex.js procedural.js gameview.js game.js bullet.js unit.js player.js main.js | uglifyjs -o ../bin/rts13k.js
cat astar.js | uglifyjs -o ../bin/astar.js
cd ..
cp index.html bin

