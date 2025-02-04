import { PI } from '../constants';

const randoms = [];
const generateRandoms = () => {
  const randomsCount = 1000;

  let i = randomsCount;

  while (i--) {
    randoms.push(Math.random());
  }
};

let currentRandom = 0;

generateRandoms();

export default {
  random: function() {
    currentRandom++;

    if (currentRandom > randoms.length - 1)
      currentRandom = ~~(Math.random() * randoms.length);

    return randoms[currentRandom];
  },
  randomAToB: function(a, b, INT) {
    if (!INT) return a + this.random() * (b - a);
    else return ((this.random() * (b - a)) >> 0) + a;
  },
  randomFloating: function(center, f, INT) {
    return this.randomAToB(center - f, center + f, INT);
  },

  randomZone: function(display) {}, //eslint-disable-line

  degreeTransform: function(a) {
    return (a * PI) / 180;
  },

  toColor16: function getRGB(num) {
    return '#' + num.toString(16);
  },

  randomColor: function() {
    return (
      '#' + ('00000' + ((this.random * 0x1000000) << 0).toString(16)).slice(-6)
    );
  },

  lerp: function(a, b, energy) {
    return b + (a - b) * energy;
  },

  getNormal: function(v, n) {
    if (v.x == 0 && v.y == 0) {
      if (v.z == 0) n.set(1, 0, 1);
      else n.set(1, 1, -v.y / v.z);
    } else {
      if (v.x == 0) n.set(1, 0, 1);
      else n.set(-v.y / v.x, 1, 1);
    }

    return n.normalize();
  },

  /**
   * Rodrigues' Rotation Formula
   * https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
   * v′ = vcos(θ) + k(k⋅v)(1−cos(θ)) + (k*v)sin(θ)
   */
  axisRotate: function(v0, v, k, tha) {
    var cos = Math.cos(tha);
    var sin = Math.sin(tha);
    var p = k.dot(v) * (1 - cos);

    v0.copy(k);
    v0.cross(v).multiplyScalar(sin);
    v0.addValue(v.x * cos, v.y * cos, v.z * cos);
    v0.addValue(k.x * p, k.y * p, k.z * p);
  },
};
