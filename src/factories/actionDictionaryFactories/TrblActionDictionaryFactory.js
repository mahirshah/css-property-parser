const trblComputedProperties = require('../../constants/trblComputedProperties.json');

// maps the length of the property value to an array mapping the property value index that should be used for each
// computed property.
const valueLengthToTrblPropertyIndexMap = {
  1: [1, 1, 1, 1],
  2: [1, 2, 1, 2],
  3: [1, 2, 3, 2],
  4: [1, 2, 3, 4],
};

module.exports = class TrblActionDictionaryFormatter {
  /**
   * Generates the semantic action dictionary for the given TRBL shorthand property. TRBL shorthand properties are those
   * that can be expanded to top, right, bottom, right longhand forms. The action dictionary maps the property value to
   * its expanded format. For example, given 'margin', this function will return an action dictionary that will expand
   * a margin property value to its longhand form.
   *
   * @param {string} propertyName - the css property name. For example, 'margin' or 'padding'.
   * @returns {Object} - the semantic action dictionary for the given property's Ohm grammar.
   */
  static createActionDictionary(propertyName) {
    const trblProperties = trblComputedProperties[propertyName];

    return {
      Exp(first, second, third, fourth) {
        const propertyValues = [...arguments]
          .map(property => property.sourceString)
          .filter(Boolean);

        return valueLengthToTrblPropertyIndexMap[propertyValues.length]
          .reduce((expandedPropertyMap, propertyValueIndex, idx) => (
            Object.assign({ [trblProperties[idx]]: propertyValues[propertyValueIndex - 1] }, expandedPropertyMap)
          ), {});
      },
    };
  }
};
