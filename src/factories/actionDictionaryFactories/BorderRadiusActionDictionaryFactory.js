const otherComputedPropertiesMap = require('../../constants/otherComputedPropertiesMap.json');

// maps the length of the property value to an array mapping the property value index that should be used for each
// computed property.
const valueLengthToCornerPropertyIndexMap = {
  0: [],
  1: [1, 1, 1, 1],
  2: [1, 2, 1, 2],
  3: [1, 2, 3, 2],
  4: [1, 2, 3, 4],
};

module.exports = class BorderRadiusActionDictionaryFactory {
  /**
   * Generates the semantic action dictionary for the given BorderRadius shorthand property.
   * The returned action dictionary converts a border-radius value to its expanded format.
   *
   * @param {string} propertyName - the css property name. i.e. 'border-radius'
   * @returns {Object} - the semantic action dictionary for the given property's Ohm grammar.
   */
  static createActionDictionary(propertyName) {
    const borderRadiusComputedProperties = otherComputedPropertiesMap[propertyName];

    return {
      Exp(radius1, radius2, radius3, radius4, slash, aRadius1, aRadius2, aRadius3, aRadius4) {
        const radiusValues = [...arguments]
          .slice(0, 4)
          .map(property => property.sourceString)
          .filter(Boolean);
        const radiusValueMap = valueLengthToCornerPropertyIndexMap[radiusValues.length]
          .reduce((expandedPropertyMap, propertyValueIndex, idx) => (
            Object.assign({
              [borderRadiusComputedProperties[idx]]: radiusValues[propertyValueIndex - 1],
            }, expandedPropertyMap)
          ), {});
        const additionalValues = [...arguments]
          .slice(5)
          .map(property => property.children.length && property.children[0].sourceString)
          .filter(Boolean);
        const additionalValueMap = valueLengthToCornerPropertyIndexMap[additionalValues.length]
          .reduce((expandedPropertyMap, propertyValueIndex, idx) => (
            Object.assign({
              [borderRadiusComputedProperties[idx]]: additionalValues[propertyValueIndex - 1],
            }, expandedPropertyMap)
          ), {});

        return Object.entries(radiusValueMap)
          .map(([property, value]) => (additionalValueMap[property]
            ? [property, `${value} / ${additionalValueMap[property]}`]
            : [property, value]))
          .reduce((propertyMap, [key, value]) => Object.assign({ [key]: value }, propertyMap), {});
      },
    };
  }
};
