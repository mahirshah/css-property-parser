module.exports = class ArrayUtils {
  /**
   * Creates a reduction function to be used in an {@link Array#reduce}, which reduces an array of an object's entries
   * to an object. Optionally, takes in keyMapper and valueMapper functions to transform the object's keys/values. If
   * no keyMapper/valueMapper is provided, defaults to the identity function.
   * @param {Function} [keyMapper=ArrayUtils.identityFunction] - a function to transform the keys in the returned object
   * @param {Function} [valueMapper=ArrayUtils.identityFunction] - a function to transform the values in the returned
   *                                                               object
   * @returns {function(Object, Array): Object} - the reduction function
   * @static
   *
   * @example
   * Object.entries({ a: 1 }).reduce(ArrayUtils.entriesToObject(), {})
   * -> { a: 1 }
   *
   * @example
   * Object.entries({ a: 1 }).reduce(ArrayUtils.entriesToObject((key) => key.toUpperCase(), (value) => value + 1), {})
   * -> { A: 2 }
   */
  static entriesToObject(keyMapper = ArrayUtils.identityFunction, valueMapper = ArrayUtils.identityFunction) {
    return (object, [key, value], idx) => (
      Object.assign({ [keyMapper(key, value, idx)]: valueMapper(value, key, idx) }, object)
    );
  }

  /**
   * Returns the value provided, unmodified.
   * @param {*} value - the value
   * @returns {*} - the value
   * @static
   */
  static identityFunction(value) {
    return value;
  }
};
