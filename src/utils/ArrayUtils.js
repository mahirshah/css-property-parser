module.exports = class ArrayUtils {
  /**
   * Given an array and a predicate, paritions the array into an array containing matched and rejected elements.
   * @param array - the array to partiion
   * @param {Function} predicate - a predicate function to partition the array elements by
   * @returns {Array} - an array with index 0 equal to the array of matched elements, and index 1 equal to the array
   *                    of rejected elements
   */
  static partition(array, predicate) {
    return array
      .reduce(([matched, rejected], element) => (
        predicate(element)
          ? [matched.concat(element), rejected]
          : [matched, rejected.concat(element)]
      ), [[], []]);
  }
};
