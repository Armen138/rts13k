var pathFinder = (function() {
	var available = [],
	//worker = new Worker("js/astar.js"),
		MAX_WORKERS = 16,
		queue = [],
		busy = false;
	for(var i = 0; i < MAX_WORKERS; i++) {
		available.push(new Worker("js/astar.js"));
	}
	return {
		find: function(start, end, callback) {
			if(available.length > 0) {
				(function(worker, start, end, callback) {
					worker.postMessage({ collisionMap: game.collisionMap, x1: start.X, y1: start.Y, x2: end.X, y2: end.Y});
					worker.onmessage = function(e) {
						callback(e.data);
						available.push(worker);
						if(queue.length > 0) {
							var n = queue.shift();
							pathFinder.find(n.start, n.end, n.cb);
						}
					};
				}(available.shift(), start, end, callback));
/*				busy = true;
				worker.postMessage({ collisionMap: game.collisionMap, x1: start.X, y1: start.Y, x2: end.X, y2: end.Y});
				worker.onmessage = function(e) {
					callback(e.data);
					busy = false;
					if(queue.length > 0) {
						var n = queue.shift();
						pathFinder.find(n.start, n.end, n.cb);
					}
				};*/
			} else {
				queue.push({ start: start, end: end, cb: callback });
			}
		}
	};
}());