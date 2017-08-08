const shorthandIdentToLonghandPropertyMap = require('../../constants/shorthandIdentToLonghandPropertyMap.json');

// maps the length of the property value to an array mapping the property value index that should be used for each
// computed property.
const valueLengthToTrblPropertyIndexMap = {
  1: [1, 1, 1, 1],
  2: [1, 2, 1, 2],
  3: [1, 2, 3, 2],
  4: [1, 2, 3, 4],
};

module.exports = class TrblPropertyFormatter {
  /**
   * Formats a parser tree generated from feeding a shorthand property value to nearley, into an object mapping
   * longhand property names to their values.
   *
   * @param {string} propertyName - the css property name. For example, 'border' or 'flex-flow'.
   * @param {Object} node - the root node of the nearley parser tree
   * @param {string} value - the property value string. For example, "1px solid black".
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node, value) {
    const trblProperties = shorthandIdentToLonghandPropertyMap[propertyName];
    const propertyValues = value.split(/\s+/);

    return valueLengthToTrblPropertyIndexMap[propertyValues.length]
      .reduce((expandedPropertyMap, propertyValueIndex, idx) => (
        Object.assign({ [trblProperties[idx]]: propertyValues[propertyValueIndex - 1] }, expandedPropertyMap)
      ), {});
  }
};
