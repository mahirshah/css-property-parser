const expandShorthandProperty = require('./expandShorthandProperty');
const isShorthandProperty = require('./isShorthandProperty');
const { initialValue } = require('./initialValueMap');

/**
 * Because of the `initial` keyword and shorthand expansion,
 * there are many possible values that are equivalently identical
 * with the initial value of a css property. This function
 * returns true for all possible values that have the effect of
 * setting a property to its initial value.
 *
 * @param {string} property the property to which  the value is assigned
 * @param {string} value the value to check
 * @return {boolean} whether the value is equivalent to the initial value.
 */
function isInitialValue(property, value) {
  const expanded = expandShorthandProperty(property, value, true, true);
  return Object.entries(expanded).every(([prop, val]) => {
    // eslint-disable-next-line no-param-reassign
    val = val.toLowerCase();
    if (isShorthandProperty(prop)) return true;
    if (val === 'initial') return true;
    const canonicalInitialValue = initialValue(prop).toLowerCase();
    if (val === canonicalInitialValue) return true;
    if (canonicalInitialValue === '0') { // all lengths
      if (/^0(px|mm|cm|in|pt|pc|q|mozmm)$/.test(val)) {
        return true;
      }
    }
    return false;
  });
}

module.exports = isInitialValue;
