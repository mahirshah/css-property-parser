const shorthandIdentToLonghandPropertyMap = require('../../constants/shorthandIdentToLonghandPropertyMap.json');

// maps the length of the property value to an array mapping the property value index that should be used for each
// computed property.
const valueLengthToCornerPropertyIndexMap = {
  0: [],
  1: [1, 1, 1, 1],
  2: [1, 2, 1, 2],
  3: [1, 2, 3, 2],
  4: [1, 2, 3, 4],
};

module.exports = class BorderRadiusPropertyFormatter {
  /**
   * Formats a border-radius value into an object mapping border-radius longhand property names to their
   * values.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius | border-radius spec}
   *
   * @param {string} propertyName - the css property name. In this case, 'border-radius'
   * @param {Object} node - the root node of the nearley parser tree
   * @param {string} value - the property value string. For example, "4px 4px 3px / 2px".
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node, value) {
    // split property value by any whitespace or by the "/"
    const [firstRadii, additionalRadii = ''] = value.split('/');
    const borderRadiusProperties = shorthandIdentToLonghandPropertyMap[propertyName];

    // get everything before the '/' and create a map from longhand property name to value
    const radiusValues = firstRadii.trim().split(/\s+/);
    const radiusValueMap = valueLengthToCornerPropertyIndexMap[radiusValues.length]
      .reduce((expandedPropertyMap, propertyValueIndex, idx) => (
        Object.assign({
          [borderRadiusProperties[idx]]: radiusValues[propertyValueIndex - 1],
        }, expandedPropertyMap)
      ), {});

    // do the same for everything after the '/'
    const additionalValues = additionalRadii.trim().split(/\s+/);
    const additionalValueMap = valueLengthToCornerPropertyIndexMap[additionalValues.length]
      .reduce((expandedPropertyMap, propertyValueIndex, idx) => (
        Object.assign({
          [borderRadiusProperties[idx]]: additionalValues[propertyValueIndex - 1],
        }, expandedPropertyMap)
      ), {});

    // merge radiusValues and additional values for each longhand property
    return Object.entries(radiusValueMap)
      .map(([property, value]) => (additionalValueMap[property]
        ? [property, `${value} / ${additionalValueMap[property]}`]
        : [property, value]))
      .reduce((propertyMap, [key, value]) => Object.assign({ [key]: value }, propertyMap), {});
  }
};
