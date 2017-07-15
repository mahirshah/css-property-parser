const shortHandProperties = require('../formatted-data/shorthand-properties.json');

/**
 * Checks if a given property is a shorthand property
 * @param {String} property - the property name
 * @returns {boolean} - true if property is a shorthand, false otherwise
 */
module.exports = function isShorthandProperty(property) {
  return Object.keys(shortHandProperties).includes(property);
};
