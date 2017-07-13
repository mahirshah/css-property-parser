const { css: { properties } } = require('mdn-data');

/**
 * Given a shorthand property, returns an array of the computed properties for that shorthand property.
 *
 * @param {string} shorthandProperty - the shorthand property name. For example, "background" or "border".
 * @returns {Array} - an array containing the computed properties for the given shorthand property. Returns an
 *                    empty array if the given property is not a valid property, or is not a shorthand property.
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
 * getShorthandComputedProperties('unknownProperty') ->
 * []
 */
module.exports = function getShorthandComputedProperties(shorthandProperty) {
  if (properties[shorthandProperty] && Array.isArray(properties[shorthandProperty].computed)) {
    return properties[shorthandProperty].computed;
  }

  return [];
};
