const shorthandIdentToLonghandPropertyMap = require('../constants/shorthandIdentToLonghandPropertyMap.json');

module.exports = class ShorthandPropertyTypeFormatterUtils {
  /**
   * Given the root node of a nearley parse tree, returns an array of nodes whose name is in the given nodeNames array.
   * @param {Object} baseNode - the root node of the parse tree
   * @param {[String]} nodeNames - array of node names to keep
   * @return {Array} - array of filtered nodes
   */
  static filterNodesByName(baseNode, nodeNames) {
    return (function recurseParseTree(node, filteredNodes = []) {
      if (typeof node !== 'object' || node === null) {
        return filteredNodes;
      } else if (node.type && node.value) {
        return filteredNodes;
      } else if (nodeNames.includes(node.name)) {
        return filteredNodes.concat(node);
      } else if (Array.isArray(node)) {
        return node.length
          ? [].concat(...node.map(inner => recurseParseTree(inner, filteredNodes)))
          : filteredNodes;
      }

      return [].concat(...node.values.map(child => recurseParseTree(child, filteredNodes)));
    }(baseNode));
  }

  /**
   * Given a parse tree node, returns an array of all of the tokens in the node. The tokens are the tokens returned
   * by the Moo Lexer, used in the nearley grammar.
   *
   * @param {Object} node - the parse tree node
   * @return {Array} - array of tokens
   */
  static getTokensFromNode(node) {
    return (function recurseParseTree(node, tokens = []) {
      if (typeof node !== 'object' || node === null) {
        return tokens;
      } else if (node.type && node.value) {
        return tokens.concat(node);
      } else if (Array.isArray(node)) {
        return node.length
          ? [].concat(...node.map(inner => recurseParseTree(inner, tokens)))
          : tokens;
      }

      return [].concat(...node.values.map(child => recurseParseTree(child, tokens)));
    }(node));
  }

  /**
   * Given a shorthand property name and a shorthand property node, returns an object mapping the longhand properties
   * to the their values in the property node.
   * @param {string} propertyName - the shorthand property name. For example, 'border'.
   * @param {Object} propertyNode - the shorthand property node
   * @returns {Object} - mapping between longhand property names and their corresponding index in the original property
   *                     value string.
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
        return node.length
          ? Object.assign(...node.map(inner => recurseLonghandPropertyNode(inner, obj)))
          : obj;
      }

      return Object.assign(...node.values.map(child => recurseLonghandPropertyNode(child, obj)));
    }(propertyNode));
  }

  /**
   * Given a shorthand property name and a shorthand property node, returns an object mapping the longhand properties
   * to the their nodes in the parse tree. This should only be used for comma separated list shorthand properties.
   *
   * @param {string} propertyName - the shorthand property name. For example, 'animation'.
   * @param {Object} propertyNode - the shorthand property node
   * @returns {Object} - mapping between longhand property names and their corresponding nodes in the parse tree
   */
  static getPropertyNodeMappingCommaSeparatedList(propertyName, propertyNode) {
    const longhandRuleNameToPropertyNameMap = shorthandIdentToLonghandPropertyMap[propertyName];
    const longhandRuleNames = Object.keys(longhandRuleNameToPropertyNameMap)
      .filter(ruleName => longhandRuleNameToPropertyNameMap[ruleName] !== '');

    // for rule names, such as "time" in animation and transition that are mapped to an array of properties, we need
    // to keep track of which instance of "time" we have seen. Thus we create a mapping between the rule name and
    // how many times we encounter the rule name. For example, for animation this would be: { "time": 0 }. Then,
    // we map the first instance of "time" to "animation-duration" and the second occurrence of "time" to
    // "animation-delay"
    const arrayPropertyIndexMap = Object.entries(longhandRuleNameToPropertyNameMap)
      .filter(([, value]) => Array.isArray(value))
      .reduce((propertyMap, [propName]) => Object.assign({ [propName]: 0 }, propertyMap), {});
    const arrayPropertyRuleNames = Object.keys(arrayPropertyIndexMap);

    return (function recurseLonghandPropertyNode(node, obj = {}) {
      if (typeof node !== 'object' || node === null) {
        return obj;
      } else if (node.type && node.value) {
        return obj;
      } else if (arrayPropertyRuleNames.includes(node.name)) {
        const propertyObject = {
          [longhandRuleNameToPropertyNameMap[node.name][arrayPropertyIndexMap[node.name]]]: node,
        };
        arrayPropertyIndexMap[node.name] += 1;
        return propertyObject;
      } else if (longhandRuleNames.includes(node.name)) {
        return { [longhandRuleNameToPropertyNameMap[node.name]]: node };
      } else if (Array.isArray(node)) {
        return node.length
          ? Object.assign(...node.map(inner => recurseLonghandPropertyNode(inner, obj)))
          : obj;
      }

      return Object.assign(...node.values.map(child => recurseLonghandPropertyNode(child, obj)));
    }(propertyNode));
  }

  /**
   * Given an array of property maps, mapping property names to their values, returns an object mapping the property
   * names to property values joined by the given delimiter.
   * @param {[Object]} propertyMaps - an array of objects mapping property names to their values
   * @param {String} [delimiter=", "] - the delimiter to join the property values by
   * @returns {Object} - merged object mapping property names to joined values
   */
  static mergePropertyMaps(propertyMaps, delimiter = ', ') {
    return Object.keys(Object.assign({}, ...propertyMaps))
      .reduce((joinedPropertyMap, propertyName) => Object.assign({
        [propertyName]: propertyMaps.map(propertyMap => propertyMap[propertyName]).filter(Boolean).join(delimiter),
      }, joinedPropertyMap), {});
  }
};
