define("canvas", function() {
	var canvas = document.getElementsByTagName("canvas")[0];
	function Canvas(canvas) {
		canvas = canvas || document.createElement("canvas");
		var context = canvas.getContext("2d");
		var C = {
			element: canvas,
			context: context,
			imageData: function(data) {
				if(data) {
					context.putImageData(data, 0, 0);
				}
				return context.getImageData(0, 0, canvas.width, canvas.height);
			},
			create: function(size) {
				var newCanvas = Canvas();
				newCanvas.size(size);
				return newCanvas;
			},
			clone: function(empty) {
				var clone = Canvas();
				clone.size(C.size());
				if(!empty) {
					clone.context.drawImage(C.element, 0,  0);
				}
				return clone;
			},
			clear: function(color) {
				if(!color) {
					canvas.width = canvas.width;
				} else {
					context.save();
					context.fillStyle = color;
					context.fillRect(0, 0, canvas.width, canvas.height);
					context.restore();
				}
			},
			size: function(w, h) {
				if(w) {
					if(typeof(w) === "object") {
						canvas.width = w.W || w.width;
						canvas.height = w.H || w.height;
					} else {
						canvas.width = w;
						canvas.height = h;
					}
				}
				return { width: canvas.width, height: canvas.height };
			}
		};
		Object.defineProperty(C, "width", {
			get: function() { return canvas.width; },
			set: function(w) { canvas.width = w; }
		});
		Object.defineProperty(C, "height", {
			get: function() { return canvas.height; },
			set: function(h) { canvas.height = h; }
		});

		C.position = (function() {
            var x = 0,
                y = 0,
                parent = C.element;
            while(parent) {
                x += parent.offsetLeft;
                y += parent.offsetTop;
                parent = parent.parentElement;
            }
            return {X: x, Y: y};
        }());

		return C;
	}
	return Canvas(canvas);
});