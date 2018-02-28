const properties = require('./formatted-data/properties.json');

/**
 * Given a shorthand property, returns an array of the computed properties for that shorthand property. If given
 * a known property that is not a shorthand, simply returns the given property. If given an unknown property,
 * returns an empty array.
 *
 * @param {string} shorthandProperty - the shorthand property name. For example, "background" or "border".
 * @param {boolean} [recursivelyResolve=false] - recursively resolve additional longhand properties if the shorthands
 *                                              expand to additional shorthands. For example, the border property
 *                                              expands to border-width, which expands further to border-left-width,
 *                                              border-right-width, etc.
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
 * getShorthandComputedProperties('border', true) ->
 * [
 *     "border-width",
 *     "border-style",
 *     "border-color",
 *     "border-bottom-width",
 *     "border-left-width",
 *     "border-right-width",
 *     "border-top-width",
 *     "border-bottom-style",
 *     "border-left-style",
 *     "border-right-style",
 *     "border-top-style",
 *     "border-bottom-color",
 *     "border-left-color",
 *     "border-right-color",
 *     "border-top-color",
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
module.exports = function getShorthandComputedProperties(shorthandProperty, recursivelyResolve = false) {
  if (properties[shorthandProperty]) {
    if (Array.isArray(properties[shorthandProperty].computed)) {
      const computedProperties = properties[shorthandProperty].computed;

      return recursivelyResolve
        ? computedProperties.concat(...computedProperties
          .filter(property => Array.isArray(properties[property].computed))
          .map(property => getShorthandComputedProperties(property, true))
        )
        : computedProperties;
    }

    return [shorthandProperty];
  }

  return [];
};
