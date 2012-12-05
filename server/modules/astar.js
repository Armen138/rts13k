function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] == node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (i != len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else
            this.sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  },

  size: function() {
    return this.content.length;
  },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to move it further.
      else {
        break;
      }
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};


function PathNode(position) {
	return {
		G: 0,
		H: 0,
		F: 0,
		position: position
	};
}

function populateGrid(w, h) {
	var grid = [];
	for(var x = 0; x < w; x++) {			
		grid[x] = [];
	}
	grid.get = function(position) {
		if(!grid[position.X][position.Y]) {
			grid[position.X][position.Y] = PathNode({X: position.X, Y: position.Y });
		}
		return grid[position.X][position.Y];
	};
	return grid;
}


exports.findPath = function(collisionMap, s, e) {
		function getNeighbors(node) {				
			function valid(x, y) {
				if (x >= 0 && 
					x < collisionMap.length &&
					y >= 0 &&
					y < collisionMap[0].length) {
					return pathGrid.get({X: x, Y: y});
				}
				return null;
			}
			var neighbors = [],
				neighbor = null;
			if(neighbor = valid(node.position.X, node.position.Y - 1)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X - 1, node.position.Y - 1)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X - 1, node.position.Y)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X, node.position.Y + 1)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X + 1, node.position.Y + 1)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X + 1, node.position.Y)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X + 1, node.position.Y - 1)) neighbors.push(neighbor);
			if(neighbor = valid(node.position.X - 1, node.position.Y + 1)) neighbors.push(neighbor);
			return neighbors;
		}


		function heuristic(start, end) {
			return Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y);
		}

		var pathGrid = populateGrid(collisionMap.length, collisionMap[0].length),
			openList = new BinaryHeap(function(n) { return n.F; }),				
			start = pathGrid.get(s),
			end = pathGrid.get(e);
		start.H = heuristic(s, e);
		start.F = heuristic(s, e);
		openList.push(start);

		while(openList.size() > 0) {				
			var currentNode = openList.pop();
			var neighbors = getNeighbors(currentNode);
			if(currentNode == end) {
				var path = [];
				while(currentNode) {
					path.unshift(currentNode.position);
					currentNode = currentNode.parent;
				}
				return path;
			}
			currentNode.closed = true;
			for(var n = 0; n < neighbors.length; n++) {
				var neighbor = neighbors[n];
				if(!neighbor.closed && collisionMap[neighbor.position.X][neighbor.position.Y] === 0) {
					var g = currentNode.G + 1,
						visited = neighbor.visited;
					if(!visited || g < neighbor.G) {
						neighbor.visited = true;
						neighbor.parent = currentNode;
						neighbor.H = neighbor.H > 0 ? neighbor.H : heuristic(neighbor.position, e);
						neighbor.G = g;
						neighbor.F = neighbor.G + neighbor.H;						
						if(!visited) {
							openList.push(neighbor);
						}	

					} else {
						openList.remove(neighbor);
						openList.push(neighbor);
						//openList.rescoreElement(neighbor);
					}					
				}
			}
		}
		//No path found
		return [];	 
};
