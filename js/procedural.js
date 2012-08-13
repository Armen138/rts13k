var procedural = {};

procedural.terrain = function(w, h, color) {
	var d = makeCanvas(w, h);
	d.context.fillStyle = color.toString();
	d.context.fillRect(0, 0, w, h);
	color.mul(0.8);
	d.context.fillStyle = color.toString();
	for(var i = 0; i < 128; i++) {
		var x = Math.random() * w | 0;
		var y = Math.random() * h | 0;
		d.context.fillRect(x, y, Math.random() * 4 | 0, Math.random() * 4 | 0);
	}
	return d.canvas;
};

procedural.noise = function(w, h, res, lvl, color) {
	var resolution = res || 10,
		noise = new SimplexNoise();
	var c = makeCanvas(w, h);
	var noisedImage = c.context.createImageData(w, h);
	var basecolor = color || bt.Color("#11A600");
	var levels = lvl || 3;

	for(var x = 0; x < w; x++) {
		for(var y = 0; y < h; y++) {
			var shade = parseInt((((noise.noise(x / resolution, y / resolution) + 1 )/ 2)  * levels), 10) * (256 / levels);
			noisedImage.data[(x * 4) + (y * (w * 4))] = basecolor.red / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (w * 4)) + 1] = basecolor.green / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (w * 4)) + 2] = basecolor.blue / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (w * 4)) + 3] = 255;
		}
	}

	c.context.putImageData(noisedImage, 0, 0);
	return c.canvas;
};

procedural.noiseMap = function(w, h, res, lvl) {
	var map = [],
		noise = new SimplexNoise();
	for(var x = 0; x < w; x++) {
		map[x] = new Uint8Array(h);
		for(var y = 0; y < h; y++) {
			map[x][y] = parseInt((((noise.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
		}
	}
	return map;
};

procedural.spiral = function(n) {
	if(n == 0) { return {X: 0, Y: 0}; } else {
		var shell = ((Math.sqrt(n)+1)/2) | 0,
		leg = ((n-(2*shell-1)^2)/(2*shell)) | 0,
		element = (n-(2*shell-1)^2)-2*shell*leg-shell+1,
		xn = leg===0? shell: leg===1? -element: leg===2? -shell: element,
		yn = leg===0? element : leg===1? shell : leg===2? -element : - shell;
	}
	return {X: xn, Y: yn};
};
/*
for(var i = 0; i < 100; i++){
	console.log(procedural.spiral(i));
}
*/