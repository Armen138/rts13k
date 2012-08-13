function Vector(x, y) {
	var v =  {
		X: x,
		Y: y,
		is: function(o) { return v.X === o.X && v.Y === o.Y },
		distanceTo: function(o) { return Math.sqrt(Math.pow(Math.abs(v.X - o.X), 2) + Math.pow(Math.abs(v.Y - o.Y), 2)); }
	}
	return v;
}
function isInList(item, list){
	for(var i = 0; i < list.length; i++){
		if(item.P.is(list[i].P)){
			return i;
		}
	}
	return -1;
}
function findPath(collisionMap, s, e) {
	var openList = [],
		closedList = [],
		start = Vector(s.X, s.Y),
		end = Vector(e.X, e.Y),
		currentNode = start,
		parent = { G: 0, H: start.distanceTo(end), F: start.distanceTo(end), P: start },
    	n, node, path, i, lowest;
	openList.push(parent);
	while(openList.length > 0){
		currentNode = parent.P;
		var neighbors = [ { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X, currentNode.Y - 1) },
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X - 1, currentNode.Y - 1)},
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X - 1, currentNode.Y)},
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X, currentNode.Y + 1)},
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X + 1, currentNode.Y + 1)},
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X + 1, currentNode.Y)},
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X + 1, currentNode.Y - 1)},
						  { G: parent.G + 1, H: 0, F: 0, P: Vector(currentNode.X - 1, currentNode.Y + 1)} ];

		closedList.push(parent);
		openList.splice(isInList(parent, openList), 1);
		for(n = 0; n < neighbors.length; n++){
			if(	neighbors[n].P.X > 0 &&
				neighbors[n].P.Y > 0 &&
				neighbors[n].P.X < collisionMap.length &&
				neighbors[n].P.Y < collisionMap[0].length ) {
				node = neighbors[n];
				if(node.P.is(end)){

					path = [];
					node.parent = parent;
					path.unshift({X: node.P.X, Y: node.P.Y});
					while(!node.P.is(start)){
						node = node.parent;
						path.unshift({X: node.P.X, Y: node.P.Y});
					}
					return path;
				}
				if(isInList(node, closedList) === -1 && collisionMap[node.P.X][node.P.Y] === 0 /* collision.PASSABLE */){
					node.H = node.P.distanceTo(end);
					node.F = node.G + node.H;
					var listNode = openList[isInList(node, openList)];
					if(listNode && listNode.F > node.F){
						listNode.parent = parent;
						listNode.F = node.F;
						listNode.G = node.G;
					}
					else if(!listNode){
						node.parent = parent;
						openList.push(node);
					}
				}
			}
		}
        lowest = 0;
		for(i = 0; i < openList.length; i++){
			if(openList[i].F < openList[lowest].F){
				lowest = i;
			}
		}
		parent = openList[lowest];
	}
	//No path found
	return [];
}
onmessage = function(e) {
	postMessage(findPath(e.data.collisionMap, Vector(e.data.x1, e.data.y1), Vector(e.data.x2, e.data.y2)));
};
