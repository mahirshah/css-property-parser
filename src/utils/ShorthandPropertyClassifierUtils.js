const { R_CLASSIFICATION_MAP, CLASSIFICATIONS, OTHER_PROPERTY_CLASSIFICATION_MAP } = require('../constants/shorthandProperties');

module.exports = class ShorthandPropertyClassifierUtils {
  /**
   * Given a shorthand property name and its formal syntax, returns its classification.
   *
   * @param {string} propertyName - the shorthand property name
   * @param {string} formalSyntax - the shorthand property's formal syntax
   * @returns {string} - a string indicating the classification of the shorthand property. See enum
   *                     {@link CLASSIFICATIONS} for possible classification.
   */
  static classifyLonghandProperty(propertyName, formalSyntax) {
    const [otherClassification] = Object.entries(OTHER_PROPERTY_CLASSIFICATION_MAP)
      .find(([, properties]) => properties.includes(propertyName)) || [];
    const [standardClassification = CLASSIFICATIONS.OTHER] = Object.entries(R_CLASSIFICATION_MAP)
      .find(([, regex]) => regex.test(formalSyntax)) || [];

    return otherClassification || standardClassification;
  }
};
