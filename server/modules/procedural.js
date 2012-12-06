exports.noiseMap = function(w, h, res, lvl) {
    var map = [],
        noise = new (require('./simplex').SimplexNoise)();
    for(var x = 0; x < w / 2; x++) {
        map[x * 2] = [];
        map[x * 2 + 1] = [];
        for(var y = 0; y < h / 2; y++) {
            var value = parseInt((((noise.noise(x / res, y / res) + 1 )/ 2)  * lvl), 10);
            map[x * 2][y * 2] = value;
            map[x * 2 + 1][y * 2] = value;
            map[x * 2][y * 2 + 1] = value;
            map[x * 2 + 1][y * 2 + 1] = value;
        }
    }
    return map;
};

exports.noiseMapFine = function(w, h, res, lvl) {
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