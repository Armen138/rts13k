/*
 * A speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 *
 * This could be speeded up even further, but it's useful as it is.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 * 2D version ported to Javascript by Arme138
 * original at: http://staffwww.itn.liu.se/~stegu/simplexnoise/SimplexNoise.java
 */

 // Inner class to speed upp gradient computations
// (array access is a lot slower than member access)
define(function(){
  var grad, p, perm, permMod12, F2, G2;
  function reseed(data) {
    grad = [{X: 1, Y: 1},{X: -1, Y: 1},{X: 1, Y: -1},{X: -1, Y: -1},
           {X: 1, Y: 0},{X: -1, Y: 0},{X: 1, Y: 0},{X: -1, Y: 0},
           {X: 0, Y: 1},{X: 0, Y: -1},{X: 0, Y: 1},{X: 0, Y: -1}];
    if(typeof(data) === "undefined") {
      data = {};
    }
    p = data.p || [];
    perm = [];
    permMod12 = [];
    F2 = data.F2 || 0.5*(Math.sqrt(3.0)-1.0);
    G2 = data.G2 || (3.0-Math.sqrt(3.0))/6.0;

    // To remove the need for index wrapping, double the permutation table length
    for(var i = 0; i < 512; i++) {
      if(!data.p) {
        p.push(Math.floor(Math.random() * 255));
      }
      perm.push(p[i & 255]);
      permMod12.push(perm[i] % 12);
    }
  }

  function dot(g, x, y) {
    return g.X*x + g.Y*y;
  }
  function contrib(t, gi, x, y) {
    return  t < 0 ? 0 : Math.pow(t, 4) * dot(grad[gi], x, y);
  }
  reseed();
  // 2D simplex noise
  return {
    setseed: function(data) {
      G2 = data.G2;
      F2 = data.F2;
      p = data.p;
      reseed(data);
    },
    noise: function(xin, yin) {
      // Skew the input space to determine which simplex cell we're in
      var s = (xin+yin)*F2, // Hairy factor for 2D
          i = (xin+s) | 0,
          j = (yin+s) | 0,
          t = (i+j)*G2,
          x0 = xin-(i-t), // The x,y distances from the cell origin
          y0 = yin-(j-t),
          i1, j1, x1, x2, y1, y2, ii, jj, gi0, gi1, gi2, n;
      // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.
      //var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
      if(x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6
      x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
      y1 = y0 - j1 + G2;
      x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
      y2 = y0 - 1.0 + 2.0 * G2;
      // Work out the hashed gradient indices of the three simplex corners
      ii = i & 255;
      jj = j & 255;
      gi0 = permMod12[ii+perm[jj]];
      gi1 = permMod12[ii+i1+perm[jj+j1]];
      gi2 = permMod12[ii+1+perm[jj+1]];

      // Calculate the contribution from the three corners
      n = contrib(0.5 - x0*x0-y0*y0, gi0, x0, y0) +
          contrib(0.5 - x1*x1-y1*y1, gi1, x1, y1) +
          contrib(0.5 - x2*x2-y2*y2, gi2, x2, y2);

      // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].
      return 70.0 * n;
    }
  };
});
/*
function SimplexNoise() {

}
*/