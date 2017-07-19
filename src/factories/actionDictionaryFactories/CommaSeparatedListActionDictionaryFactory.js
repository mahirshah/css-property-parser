const commaSeparatedListComputedProperties = require('../../constants/commaSeparatedListComputedProperties.json');

function getPropertyMapping(propertyName, propertyNode) {
  const longhandRuleNameToPropertyNameMap = commaSeparatedListComputedProperties[propertyName];
  const longhandRuleNames = Object.keys(longhandRuleNameToPropertyNameMap);

  // for rule names, such as "time" in animation and transition that are mapped to an array of properties, we need
  // to keep track of which instance of "time" we have seen. Thus we create a mapping between the rule name and
  // how many times we have seen the rule name before. For example, for transition this would be: { "time": 0 }. Then,
  // we map the first instance of "time" to ""animation-duration" and the second occurrence of "time" to
  // "animation-delay"
  const arrayPropertyIndexMap = Object.entries(longhandRuleNameToPropertyNameMap)
    .filter(([, value]) => Array.isArray(value))
    .reduce((propertyMap, [propName]) => Object.assign({ [propName]: 0 }, propertyMap), {});
  const arrayPropertyRuleNames = Object.keys(arrayPropertyIndexMap);

  return (function recurseLonghandPropertyNode(node, obj = {}) {
    const nodeName = node.ctorName;

    if (node.isTerminal()) {
      return obj;
    } else if (arrayPropertyRuleNames.includes(nodeName)) {
      const propertyObject = {
        [longhandRuleNameToPropertyNameMap[nodeName][arrayPropertyIndexMap[nodeName]]]: node.sourceString,
      };
      arrayPropertyIndexMap[nodeName] += 1;
      return propertyObject;
    } else if (longhandRuleNames.includes(nodeName)) {
      return { [longhandRuleNameToPropertyNameMap[nodeName]]: node.sourceString };
    }

    return Object.assign(...node.children.map(child => recurseLonghandPropertyNode(child, obj)));
  })(propertyNode);
}

module.exports = class CommaSeparatedListActionDictionaryFormatter {
  /**
   * Generates the semantic action dictionary for the given CommaSeparatedList shorthand property.
   * CommaSeparatedList shorthand properties are those that have formal syntaxes of the form
   * "<prop>#". The returned action dictionary converts a property value to its expanded format.
   * For example, given 'mask', this function will return an action dictionary that will expand a mask property
   * value to its longhand form.
   *
   * @param {string} propertyName - the css property name. For example, 'mask' or 'animation'.
   * @returns {Object} - the semantic action dictionary for the given property's Ohm grammar.
   */
  static createActionDictionary(propertyName) {
    return {
      Exp(baseNode) {
        // check if its a comma separated list. If not, just get the property mapping for the first node.
        if (baseNode.children[0].numChildren < 3) {
          return getPropertyMapping(propertyName, baseNode.children[0].children[0].children[0]);
        }

        // else get the property mapping for each single property and merge them into a comma separated list
        return [
          baseNode.children[0].children[0].children[0],
          ...baseNode.children[0].children[2].children,
        ]
          .map(getPropertyMapping.bind(null, propertyName))
          .reduce((allPropertyMap, singlePropertyMap) => (
            Object.entries(singlePropertyMap).reduce((allPropertyMap, [propertyName, propertyValue]) => (
              Object.assign(allPropertyMap, { [propertyName]: `${allPropertyMap[propertyName]}, ${propertyValue}` })
            ), allPropertyMap))
          );
      },
    };
  }
};