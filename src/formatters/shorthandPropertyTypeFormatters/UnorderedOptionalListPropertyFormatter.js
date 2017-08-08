const ShorthandPropertyTypeFormatterUtils = require('../../utils/ShorthandPropertyTypeFormatterUtils');

module.exports = class UnorderedOptionalListPropertyFormatter {
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
    return Object.entries(ShorthandPropertyTypeFormatterUtils.getPropertyLocationMapping(propertyName, node))
      .sort(([, location1], [, location2]) => location1 - location2)
      .map(([property, location], idx, entries) => {
        if (idx === entries.length - 1) {
          return [property, value.slice(location)];
        }

        return [property, value.slice(location, entries[idx + 1][1] - 1)];
      })
      .reduce((longhandMap, [longhandPropertyName, longhandPropertyValue]) => (
        Object.assign({ [longhandPropertyName]: longhandPropertyValue }, longhandMap)
      ), {});
  }
};
