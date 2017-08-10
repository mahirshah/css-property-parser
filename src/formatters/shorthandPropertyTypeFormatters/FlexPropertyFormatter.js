const ShorthandPropertyTypeFormatterUtils = require('../../utils/ShorthandPropertyTypeFormatterUtils');

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

module.exports = class BorderRadiusPropertyFormatter {
  /**
   * Formats a border-radius value into an object mapping flex longhand property names to their
   * values.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius | border-radius spec}
   *
   * @param {string} propertyName - the css property name. In this case, 'flex'
   * @param {Object} node - the root node of the nearley parser tree
   * @param {string} value - the property value string. For example, "1 0 auto".
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node, value) {
    if (flexKeywordToExpandedMap[value]) {
      return flexKeywordToExpandedMap[value];
    } else if (typeof +value === 'number' && !Number.isNaN(+value)) {
      return flexKeywordToExpandedMap.number(value);
    }

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
