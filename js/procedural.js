var procedural = {};

procedural.terrain = function(s, color) {
	var d = makeCanvas(s, s);
	d.context.fillStyle = color.toString();
	d.context.fillRect(0, 0, s, s);
	color = color.mul(0.8);
	d.context.fillStyle = color.toString();
	for(var i = 0; i < 128; i++) {
		var x = Math.random() * s | 0;
		var y = Math.random() * s | 0;
		d.context.fillRect(x, y, Math.random() * 4 | 0, Math.random() * 4 | 0);
	}
	return d.canvas;
};

procedural.terrainltr = function(s, color1, color2) {
	var d = makeCanvas(s, s),
  		grad = d.context.createLinearGradient(0,s / 2,s,s / 2);
    grad.addColorStop(0, color2.toString());
    grad.addColorStop(1, color1.toString());
    d.context.fillStyle = grad;
    d.context.fillRect(0, 0, s, s);
    return d.canvas;
};

procedural.noise = function(s, res, lvl, color) {
	var resolution = res || 10,
		noise = new SimplexNoise();
	var c = makeCanvas(s, s);
	var noisedImage = c.context.createImageData(s, s);
	var basecolor = color || bt.Color("#11A600");
	var levels = lvl || 3;

	for(var x = 0; x < s; x++) {
		for(var y = 0; y < s; y++) {
			var shade = parseInt((((noise.noise(x / resolution, y / resolution) + 1 )/ 2)  * levels), 10) * (256 / levels);
			noisedImage.data[(x * 4) + (y * (s * 4))] = basecolor.red / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (s * 4)) + 1] = basecolor.green / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (s * 4)) + 2] = basecolor.blue / 255.0 * shade;
			noisedImage.data[(x * 4) + (y * (s * 4)) + 3] = 255;
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
		leg = ((n-Math.pow((2*shell-1),2))/(2*shell)) | 0,
		element = (n-Math.pow(2*shell-1),2)-2*shell*leg-shell+1,
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