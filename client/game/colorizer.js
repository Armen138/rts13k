var ShadowMapper = function() {
    function alphaIndex(x, y, image) {
        if(x < 0 || x > image.width ||
            y < 0 || y > image.height) {
            return -1;
        }
        return (x * 4) + (y * (image.width * 4)) + 3;
    }
    function blur(x, y, image) {
        var radius = 4,
            values = 0,
            count = 0;
        for(var bx = -radius; bx < radius; bx++) {
            for(var by = -radius; by < radius; by++) {
                var idx = alphaIndex(x + bx, y + by, image);
                if(idx > 0) {
                    values += image.data[idx];
                    count++;
                }
            }
        }
        var blurred = values / count | 0;
        return blurred;
    }
    var shadowMapper = {
        shadow: function(image) {
            var imgCanvas = document.createElement("canvas");
            var imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = image.width;
            imgCanvas.height = image.height;
            imgContext.drawImage(image, 0, 0);
            var imgData = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
            var shadowData = imgContext.createImageData(imgCanvas.width, imgCanvas.height);
            for(var x = 0; x < image.width; x++) {
                for(var y = 0; y < image.width; y++) {
                    var X = blur(x, y, imgData);
                    var idx = alphaIndex(x, y, imgData);
                    shadowData.data[idx] = X;
                }
            }
            imgCanvas.width = imgCanvas.width;
            imgContext.putImageData(shadowData, 0, 0);
            return imgCanvas;
        }
    };
    return shadowMapper;
};

var Colorizer = function() {
    var Color = function(r, g, b, a) {
        "use strict";
        var h, s, l;
        if(typeof(r) === "string" && r[0] === '#') {
            if(r.length === 4) {
                g = (parseInt(r[2], 16) + 1) * 16;
                b = (parseInt(r[3], 16) + 1) * 16;
                r = (parseInt(r[1], 16) + 1) * 16;
            } else {
                g = (parseInt(r.substr(3, 2), 16) + 1);
                b = (parseInt(r.substr(5, 2), 16) + 1);
                r = (parseInt(r.substr(1, 2), 16) + 1);
            }
        }
        // HSL-RGB conversion adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
        function resetHsl(){
            var nr =  r / 255, ng = g / 255, nb = b / 255,
                max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb),
                d = max - min;
            l = (max + min) / 2;

            if(max == min){
                h = s = 0; // achromatic
            }else{
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case nr: h = (ng - nb) / d + (ng < nb ? 6 : 0); break;
                    case ng: h = (nb - nr) / d + 2; break;
                    case nb: h = (nr - ng) / d + 4; break;
                }
                h /= 6;
            }
        }
        function resetRgb(){
            if(s === 0){
                r = g = b = l; // achromatic
            }else{
                var hue2rgb = function(p, q, t){
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    },
                    q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                    p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            r *= 255;
            g *= 255;
            b *= 255;
        }
        resetHsl();
        return Object.create({},{
            array: {
                get: function() {
                    return [r, g, b];
                },
                set: function(a) {
                    r = a[0];
                    g = a[1];
                    b = a[2];
                }
            },
            hue: {
                get: function() { return h; },
                set: function(hue) { h = hue; resetRgb(); }
            },
            saturation: {
                get: function() { return s; },
                set: function(saturation) { s = saturation; resetRgb(); }
            },
            lightness: {
                get: function() { return l; },
                set: function(lightness) { l = lightness; resetRgb(); }
            },
            red: {
                get: function() { return r; },
                set: function(red) { r = red; resetHsl(); }
            },
            green: {
                get: function() { return g; },
                set: function(green) { g = green;  resetHsl(); }
            },
            blue: {
                get: function() { return b; },
                set: function(blue) { b = blue;  resetHsl(); }
            },
            alpha: {
                get: function() { return a; },
                set: function(alpha) { a = alpha; }
            },
            toString: {
                value : function() { return "rgba(" + r + "," + g + "," + b + "," + a + ")"; }
            },
            mul: {
                value: function(x) {
                    var c = Color("#FFF");
                    c.red = r * x | 0;
                    c.green = g * x | 0;
                    c.blue = b * x | 0;
                    return c;
                }
            },
            type: { value: "color" }
        });
    };

    return {
        swapHues: function(image, hue1, hue2) {
            var imgCanvas = document.createElement("canvas");
            var imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = image.width;
            imgCanvas.height = image.height;
            imgContext.drawImage(image, 0, 0);
            var imgData = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
            for(var i = 0; i < imgData.width * imgData.height; i++) {
                if(imgData.data[i * 4] > imgData.data[i * 4 + 1] && imgData.data[i * 4] > imgData.data[i * 4 + 2]) {
                    var color = Color(imgData.data[i * 4], imgData.data[i * 4 + 1], imgData.data[i * 4 + 2], imgData.data[i * 4 + 3]);
                    color.hue = hue2;
                    imgData.data[i * 4] = color.red;
                    imgData.data[i * 4 + 1] = color.green;
                    imgData.data[i * 4 + 2] = color.blue;
                    imgData.data[i * 4 + 3] = color.alpha;
                }
            }
            imgCanvas.width = imgCanvas.width;
            imgContext.putImageData(imgData, 0, 0);
            return imgCanvas;
        },
        Color: Color
    };
};