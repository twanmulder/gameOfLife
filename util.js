export function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19));
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDistribution(array) {
  const distribution = [];

  let sum = 0;
  array.forEach((element) => {
    sum += element.probability;
  });
  const size = sum * 10;

  for (let i = 0; i < array.length; ++i) {
    const count = (array[i].probability / sum) * size;
    for (let j = 0; j < count; ++j) {
      distribution.push(i);
    }
  }
  return distribution;
}

export function randomIndex(distribution, randomFloat) {
  const index = Math.floor(distribution.length * randomFloat);
  return distribution[index];
}
