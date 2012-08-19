var pathFinder = (function() {
	var worker = new Worker("js/astar.js"),
		queue = [],
		busy = false;
	return {
		find: function(start, end, callback) {
			if(!busy) {
				busy = true;
				worker.postMessage({ collisionMap: game.collisionMap, x1: start.X, y1: start.Y, x2: end.X, y2: end.Y});
				worker.onmessage = function(e) {
					callback(e.data);
					busy = false;
					if(queue.length > 0) {
						var n = queue.shift();
						pathFinder.find(n.start, n.end, n.cb);
					}
				};
			} else {
				queue.push({ start: start, end: end, cb: callback });
			}
		}
	};
}());