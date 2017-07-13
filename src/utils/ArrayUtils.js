module.exports = class ArrayUtils {
  /**
   * Given an array, returns all of its permutations.
   *
   * @see {@link https://stackoverflow.com/questions/9960908/permutations-in-javascript}
   *
   * @param {Array} array - the array to permute
   * @returns {Array} - a 2D array containing all of the permuations of the given array
   */
  static getPermutations(array) {
    /* eslint-disable no-param-reassign, no-plusplus */
    const length = array.length;
    const result = [array.slice()];
    const c = new Array(length).fill(0);
    let i = 1;
    let k;
    let p;

    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = array[i];
        array[i] = array[k];
        array[k] = p;
        ++c[i];
        i = 1;
        result.push(array.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }
};
