const ShorthandPropertyTypeFormatterUtils = require('../../utils/ShorthandPropertyTypeFormatterUtils');
const shorthandIdentToLonghandPropertyMap = require('../../constants/shorthandIdentToLonghandPropertyMap.json');


module.exports = class FontPropertyFormatter {
  /**
   * Formats a parser tree generated from feeding a shorthand property value to nearley, into an object mapping
   * longhand property names to their values.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font} for more info.
   *
   * @param {string} propertyName - the css property name. For example, 'font'.
   * @param {Object} node - the root node of the nearley parser tree
   * @param {string} value - the property value string. For example, '2em "Open Sans", sans-serif'.
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node, value) {
    const lineHeight = shorthandIdentToLonghandPropertyMap[propertyName].LineHeight;
    const fontSize = shorthandIdentToLonghandPropertyMap[propertyName].FontSize;
    const longhandValueMap = Object
      .entries(ShorthandPropertyTypeFormatterUtils.getPropertyLocationMapping(propertyName, node))
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

    // line-height must immediately follow font-size, preceded by "/", like this: "16px/3". So font-size
    // may have an extra "/" character at the end that we need to remove.
    if (longhandValueMap[lineHeight] && longhandValueMap[fontSize]) {
      longhandValueMap[fontSize] = longhandValueMap[fontSize].replace('/', '').trim();
    }

    return longhandValueMap;
  }
};
