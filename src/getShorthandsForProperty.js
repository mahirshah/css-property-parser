const shortHandProperties = require('../formatted-data/shorthand-properties.json');
const properties = require('../formatted-data/properties.json');

/**
 * @type {Object}
 */
const inverseMapping = {};

function computeInverseMapping() {
  const shorthands = Object.keys(shortHandProperties);
  shorthands.forEach((shorthand) => {
    const longhands = shortHandProperties[shorthand].computed;
    longhands.forEach((longhand) => {
      if (inverseMapping[longhand]) {
        inverseMapping[longhand].push(shorthand);
      } else {
        inverseMapping[longhand] = [shorthand];
      }
    });
  });
  const longhands = Object.keys(inverseMapping);
  longhands.forEach((longhand) => {
    inverseMapping[longhand].forEach((shorthand) => {
      if (inverseMapping[shorthand]) {
        inverseMapping[longhand].push(...inverseMapping[shorthand]);
      }
    });
  });
}

/**
 * Return a list of all properties that set the given property.
 * Includes at least the value provided, plus any other shorthands that can
 * set it.
 * @param {string} property - the property name
 * @return {Array<string>} all properties that set this property.
 * @example
 *   console.log(getShorthandsForProperty('border-left-width'));
 *   // => [ 'border-left-width', 'border-left', 'border-width', 'border' ]
 */
module.exports = function getShorthandsForProperty(property) {
  if (!inverseMapping['background-image']) computeInverseMapping();
  if (!properties[property]) return [];
  return [property, ...(inverseMapping[property] || [])];
};
