const otherComputedPropertiesMap = require('../../constants/otherComputedPropertiesMap.json');

const flexKeywordToExpandedMap = {
  auto: {
    'flex-grow': '1',
    'flex-shrink': '1',
    'flex-basis': 'auto',
  },
  initial: {
    'flex-grow': '0',
    'flex-shrink': '1',
    'flex-basis': 'auto',
  },
  none: {
    'flex-grow': '0',
    'flex-shrink': '0',
    'flex-basis': 'auto',
  },
  number(num) {
    return {
      'flex-grow': num,
      'flex-shrink': '1',
      'flex-basis': '0',
    };
  },
};

function getPropertyMapping(propertyName, propertyNode) {
  const longhandRuleNameToPropertyNameMap = otherComputedPropertiesMap[propertyName];
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

    const propertyNodeObjects = node.children
      .filter(child => child.sourceString)
      .map(child => recurseLonghandPropertyNode(child, obj));
    return Object.assign(...propertyNodeObjects);
  })(propertyNode);
}

module.exports = class FlexActionDictionaryFactory {
  static createActionDictionary(propertyName) {
    return {
      Exp(baseNode) {
        const baseNodeString = baseNode.sourceString;

        if (flexKeywordToExpandedMap[baseNodeString]) {
          return flexKeywordToExpandedMap[baseNodeString];
        } else if (typeof +baseNodeString === 'number' && !Number.isNaN(+baseNodeString)) {
          return flexKeywordToExpandedMap.number(baseNodeString);
        }

        return getPropertyMapping(propertyName, baseNode);
      },
    };
  }
};
