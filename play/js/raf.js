define ("raf", function() {
	var requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(cb) {
			setTimeout(cb, 17);
		});
	return {
		requestAnimationFrame: requestAnimationFrame
	};
});