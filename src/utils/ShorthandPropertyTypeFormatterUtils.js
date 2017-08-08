const shorthandIdentToLonghandPropertyMap = require('../constants/shorthandIdentToLonghandPropertyMap.json');

module.exports = class ShorthandPropertyTypeFormatterUtils {
  /**
   * Given a shorthand property name and a shorthand property node, returns an object mapping the longhand properties
   * to the their values in the property node.
   * @param {string} propertyName - the shorthand property name. For example, 'border'.
   * @param {Object} propertyNode - the shorthand property node
   * @returns {Object} - mapping between longhand property names and their corresponding index in the original property
   *                     value string.
   * TODO: make sure there are no duplicate props
   */
  static getPropertyLocationMapping(propertyName, propertyNode) {
    const longhandRuleNameToPropertyNameMap = shorthandIdentToLonghandPropertyMap[propertyName];
    const longhandRuleNames = Object.keys(longhandRuleNameToPropertyNameMap);

    return (function recurseLonghandPropertyNode(node, obj = {}) {
      if (typeof node !== 'object' || node === null) {
        return obj;
      } else if (longhandRuleNames.includes(node.name)) {
        return { [longhandRuleNameToPropertyNameMap[node.name]]: node.location };
      } else if (Array.isArray(node)) {
        return Object.assign(...node.map(inner => recurseLonghandPropertyNode(inner, obj)));
      }

      return Object.assign(...node.values.map(child => recurseLonghandPropertyNode(child, obj)));
    })(propertyNode);
  }

  /**
   * Given a shorthand property name and a shorthand property node, returns an object mapping the longhand properties
   * to the their values in the property node. This should only be used for comma separated list shorthand properties.
   *
   * @param {string} propertyName - the shorthand property name. For example, 'animation'.
   * @param {Object} propertyNode - the shorthand property node
   * @returns {Object} - mapping between longhand property names and their corresponding index in the original property
   *                     value string.
   */
  static getPropertyLocationMappingCommaSeparatedList(propertyName, propertyNode) {
    const longhandRuleNameToPropertyNameMap = shorthandIdentToLonghandPropertyMap[propertyName];
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
      if (typeof node !== 'object' || node === null) {
        return obj;
      } else if (arrayPropertyRuleNames.includes(node.name)) {
        const propertyObject = {
          [longhandRuleNameToPropertyNameMap[node.name][arrayPropertyIndexMap[node.name]]]: node.location,
        };
        arrayPropertyIndexMap[node.name] += 1;
        return propertyObject;
      } else if (longhandRuleNames.includes(node.name)) {
        return { [longhandRuleNameToPropertyNameMap[node.name]]: node.location };
      } else if (Array.isArray(node)) {
        return node.length
          ? Object.assign(...node.map(inner => recurseLonghandPropertyNode(inner, obj)))
          : obj;
      }

      return Object.assign(...node.values.map(child => recurseLonghandPropertyNode(child, obj)));
    })(propertyNode);
  }
};
