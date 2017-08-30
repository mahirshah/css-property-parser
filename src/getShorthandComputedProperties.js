const { css: { properties } } = require('mdn-data');

/**
 * Given a shorthand property, returns an array of the computed properties for that shorthand property. If given
 * a known property that is not a shorthand, simply returns the given property. If given an unknown property,
 * returns an empty array.
 *
 * @param {string} shorthandProperty - the shorthand property name. For example, "background" or "border".
 * @returns {Array} - an array containing the computed properties for the given shorthand property. Returns an
 *                    empty array if the given property is not a valid property.
 *
 * @example
 * getShorthandComputedProperties('background') ->
 * [
 *   "background-image",
 *   "background-position",
 *   "background-size",
 *   "background-repeat",
 *   "background-origin",
 *   "background-clip",
 *   "background-attachment",
 *   "background-color"
 * ]
 *
 * @example
 * getShorthandComputedProperties('color') ->
 * ["color"]
 *
 * @example
 * getShorthandComputedProperties('unknownProperty') ->
 * []
 */
module.exports = function getShorthandComputedProperties(shorthandProperty) {
  if (properties[shorthandProperty]) {
    if (Array.isArray(properties[shorthandProperty].computed)) {
      return properties[shorthandProperty].computed;
    }

    return [shorthandProperty];
  }

  return [];
};
