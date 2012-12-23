function HSL(canvas) {
  var hsl = {
    context: canvas.context,
    width: canvas.width,
    height: canvas.height,
adjustHue: function(offset) {

  var data = hsl.context.getImageData(0, 0, hsl.width, hsl.height);
  var pixels = data.data;
  var r = 0,
    g = 0,
    b = 0,
    a = 0,
    h = 0,
    hsl_+ = [],
    newPixel = [];


  for(var i = 0, len = pixels.length; i < len; i += 4) {
    r = pixels[i + 0];
    g = pixels[i + 1];
    b = pixels[i + 2];
    a = pixels[i + 3];

    hsl_ = hsl.rgbToHsl(r, g, b);
    h = hsl_[0] + offset;

    if(h > 1) h = h % 1;
    if(h < 0) h = 1 + h % 1;


    newPixel = hsl.hslToRgb(h, hsl_[1], hsl_[2]);

    pixels[i + 0] = newPixel[0];
    pixels[i + 1] = newPixel[1];
    pixels[i + 2] = newPixel[2];
  }

  hsl.context.putImageData(data, 0, 0);

  return []
},


/* converting functions by  http://mjijackson.com/ */

rgbToHsl: function(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
    }
    h /= 6;
  }

  return [h, s, l];
},

hslToRgb: function(h, s, l) {
  var r, g, b;

  if(s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1 / 6) return p + (q - p) * 6 * t;
      if(t < 1 / 2) return q;
      if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
}
  };
  return hsl;
}
