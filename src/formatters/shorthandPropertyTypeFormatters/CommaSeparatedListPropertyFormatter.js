const ShorthandPropertyTypeFormatterUtils = require('../../utils/ShorthandPropertyTypeFormatterUtils');
const shorthandIdentToLonghandPropertyMap = require('../../constants/shorthandIdentToLonghandPropertyMap.json');

module.exports = class CommaSeparatedListPropertyFormatter {
  /**
   * Formats a parser tree generated from feeding a shorthand property value to nearley, into an object mapping
   * longhand property names to their values.
   *
   * @param {string} propertyName - the css property name. For example, 'transition'.
   * @param {Object} node - the root node of the nearley parser tree
   * @param {string} value - the property value string. For example, "padding-left 1s 1s".
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node, value) {
    // in the shorthand ident map, a mapping to an empty string signifies the single property rule name. For
    // example, for transition, "SingleAnimation" maps to the empty string.
    const [[singlePropertyRuleName]] = Object.entries(shorthandIdentToLonghandPropertyMap[propertyName])
      .filter(([, propertyMapping]) => propertyMapping === '');
    // get each single property and create a longhand map for it. For example, for transition, the value
    // "padding 1s, margin 1s" will produce a parse tree with multiple "SingleTransition" nodes. We format each
    // "SingleTransition" node into a longhand property map, and then merge them together.
    const singlePropertyMaps = ShorthandPropertyTypeFormatterUtils.filterNodesByName(node, [singlePropertyRuleName])
      .sort(({ location: location1 }, { location: location2 }) => location1 - location2)
      .map((layerNode, idx, originalNodeArray) => {
        const layerValueString = idx === originalNodeArray.length - 1
          ? value.slice(layerNode.location)
          : value.slice(layerNode.location, originalNodeArray[idx + 1].location - 1).replace(/,\s*$/, '').trim();

        return CommaSeparatedListPropertyFormatter._formatSingleProperty(propertyName, layerNode, layerValueString);
      });

    return ShorthandPropertyTypeFormatterUtils.mergePropertyMaps(singlePropertyMaps);
  }

  static _formatSingleProperty(propertyName, singlePropertyNode, singlePropertyValue) {
    return ShorthandPropertyTypeFormatterUtils.filterNodesByName
  }
};
