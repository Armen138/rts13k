pathfinder.js
var pathFinder = (function() {
	var MAX_WORKERS = 16,
		workers = [],
		busy = [],
		tasks = [],
		queue = [],
		current = 0;
	function report(data) {
		var task = tasks[data.data.id];
		task.cb(data.data.path);
		workers.push(task.worker);
	}	
	for( var i = 0; i < MAX_WORKERS; i++) {
		var w = new Worker("js/astar.js");
		w.addEventListener("message", report);/*function(foundPath) {
			path = foundPath.data;
			tileTime = (new Date()).getTime();
			if(path.length === 0) {
				console.log("no path!");
			} else {
				console.log("path");
			}
		});*/
		workers.push(new Worker("js/astar.js"));
	}
	return {
		findPath: function(start, end) {
			var w = workers.shift(),
				id = tasks.length;
			tasks[id] = {worker: w, id: id};
			w.postMessage({ collisionMap: game.collisionMap, x1: start.X, y1: start.Y, x2: end.X, y2: end.Y, id: id });

		}
	};
})