exports.noiseMap = function(w, h, res, lvl) {
    var map = [],
        noise = new (require('./simplex').SimplexNoise)();
    for(var x = 0; x < w; x++) {
        map[x] = [];
        for(var y = 0; y < h; y++) {
            map[x][y] = parseInt((((noise.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
        }
    }
    return map;
};