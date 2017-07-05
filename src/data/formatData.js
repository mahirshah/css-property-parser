/**
 * Takes raw data from MDN, filters out the shorthand properties, and decorates the data with additional properties.
 * Writes the formatted data to FORMATTED_DATA_PATH.
 */
const fs = require('fs-extra');
const { css: { properties } } = require('mdn-data');

const FORMATTED_DATA_PATH = './formatted-data/';
const SHORTHAND_FORMATTED_DATA_FILE_NAME = 'shorthand-properties.json';

const SHORTHAND_TYPE_MAP = {
  TRBL: /^\[? ?<['a-z-]+> ?(\| <?['a-z-]+>? ?)*]?\{1,4\}$/, // top left bottom right properties
  COMMA_SEPARATED_LIST: /<[a-z-]+>#/, // <ident>#
  OPTIONAL_UNORDERED_LIST: /^\[? ?<['a-z-]+> (\|\| <?['a-z-]+>? ?)*]?$/, // <ident> || <ident> || ....
  AND_LIST: /^\[? ?<['a-z-]+> (&& <?['a-z-]+>? ?)*]?$/, // <ident> && <ident> && ...
};
const OTHER_SHORTHAND_TYPE_NAME = 'OTHER'; // shorthand type for shorthands that don't match any of the above

const formattedData = Object.entries(properties)
  // properties that have an array as their computed value, are shorthand properties
  .filter(([, data]) => Array.isArray(data.computed))
  // add the shorthandType property to the data
  .map(([prop, data]) => [prop, Object.assign({ shorthandType: getShorthandType(data.syntax) }, data)])
  // reduce it down to an object again so we can write it to a file
  .reduce((propertyMap, [property, data]) => Object.assign({ [property]: data }, propertyMap), {});

fs.writeJson(`${FORMATTED_DATA_PATH}${SHORTHAND_FORMATTED_DATA_FILE_NAME}`, formattedData, { spaces: 2 })
  .then(() => (
    console.log(`Successfully formatted data to ${FORMATTED_DATA_PATH}${SHORTHAND_FORMATTED_DATA_FILE_NAME}`)
  ));

/**
 * Given a formal syntax returns the type of shorthand it is classified as.
 * @param {string} syntax - the formal syntax of a property
 * @returns {string} - the type of shorthand the property is. This can be a key from SHORTHAND_TYPE_MAP or
 *                     OTHER_SHORTHAND_TYPE_NAME if it does not match any known classification.
 */
function getShorthandType(syntax) {
  return Object.keys(SHORTHAND_TYPE_MAP)
      .find(shorthandType => SHORTHAND_TYPE_MAP[shorthandType].test(syntax)) || OTHER_SHORTHAND_TYPE_NAME;
}
