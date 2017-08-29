const ShorthandPropertyTypeFormatterUtils = require('../../utils/ShorthandPropertyTypeFormatterUtils');
const ArrayUtils = require('../../utils/ArrayUtils');

module.exports = class UnorderedOptionalListPropertyFormatter {
  /**
   * Formats a parser tree generated from feeding a shorthand property value to nearley, into an object mapping
   * longhand property names to their values.
   *
   * @param {string} propertyName - the css property name. For example, 'border' or 'flex-flow'.
   * @param {Object} node - the root node of the nearley parser tree
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node) {
    return Object.entries(
      ShorthandPropertyTypeFormatterUtils.getPropertyNodeMappingCommaSeparatedList(propertyName, node)
    )
      .reduce(
        ArrayUtils.entriesToObject(
          ArrayUtils.identityFunction,
          node => ShorthandPropertyTypeFormatterUtils.getTokensFromNode(node).map(token => token.text).join('')
        ),
        {}
      );
  }
};
