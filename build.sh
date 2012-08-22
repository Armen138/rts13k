cd js
cat art.js definitions.js pathfinder.js events.js nodes.js basictypes.js simplex.js procedural.js gameview.js game.js bullet.js player.js unit.js main.js | uglifyjs -o ../bin/rts13k.js
cat astar.js | uglifyjs -o ../bin/astar.js
cd ..
cp index.html bin
zip -r rts13k.zip bin
