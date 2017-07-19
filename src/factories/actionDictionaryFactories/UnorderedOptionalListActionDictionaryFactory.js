const unorderedOptionalTupleComputedProperties = require('../../constants/unorderedOptionalTupleComputedProperties.json');

/**
 * Given a shorthand property name and a shorthand property node, returns an object mapping the longhand properties
 * to the their values in the property node.
 * @param {string} propertyName - the shorthand property name. For example, 'border'.
 * @param {Object} propertyNode - the shorthand property node
 * @returns {Object} - mapping between longhand property names and their corresponding values, parsed from the given
 *                     propertyNode.
 * TODO: make sure there are no duplicate props
 */
function getPropertyMapping(propertyName, propertyNode) {
  const longhandRuleNameToPropertyNameMap = unorderedOptionalTupleComputedProperties[propertyName];
  const longhandRuleNames = Object.keys(longhandRuleNameToPropertyNameMap);

  return (function recurseLonghandPropertyNode(node, obj = {}) {
    if (node.isTerminal()) {
      return obj;
    } else if (longhandRuleNames.includes(node.ctorName)) {
      return { [longhandRuleNameToPropertyNameMap[node.ctorName]]: node.sourceString };
    }

    return Object.assign(...node.children.map(child => recurseLonghandPropertyNode(child, obj)));
  })(propertyNode);
}

module.exports = class UnorderedOptionalListActionDictionaryFormatter {
  /**
   * Generates the semantic action dictionary for the given UnorderedOptionalList shorthand property.
   * UnorderedOptionalList shorthand properties are those that have formal syntaxes of the form
   * "<prop> || <prop> || ...". The action dictionary maps the property value to its expanded format.
   * For example, given 'border', this function will return an action dictionary that will expand a border property
   * value to its longhand form.
   *
   * @param {string} propertyName - the css property name. For example, 'border' or 'flex-flow'.
   * @returns {Object} - the semantic action dictionary for the given property's Ohm grammar.
   */
  static createActionDictionary(propertyName) {
    return {
      Exp(baseNode) {
        return getPropertyMapping(propertyName, baseNode);
      },
    };
  }
};
