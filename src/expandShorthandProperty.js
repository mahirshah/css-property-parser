const nearley = require('nearley');
const { css: { properties } } = require('mdn-data');
const isShorthandProperty = require('./isShorthandProperty');
const getShorthandComputedProperties = require('./getShorthandComputedProperties');
const shorthandProperties = require('../formatted-data/shorthand-properties.json');
const CSS_CONSTANTS = require('./constants/css');
const { CLASSIFICATIONS } = require('./constants/shorthandProperties');
const LocationIndexTracker = require('./utils/LocationIndexTracker');
const PATHS = require('./constants/paths');
const { ParseError, UnsupportedPropertyError, UnknownPropertyError } = require('./errors');
const SHORTHAND_IDENT_TO_LONGHAND_PROPERTY_MAP = require('./constants/shorthandIdentToLonghandPropertyMap.json');
const {
  BackgroundPropertyFormatter,
  BorderRadiusPropertyFormatter,
  CommaSeparatedListPropertyFormatter,
  FlexPropertyFormatter,
  FontPropertyFormatter,
  TrblPropertyFormatter,
  UnorderedOptionalListPropertyFormatter,
} = require('./formatters/shorthandPropertyTypeFormatters');


const shorthandPropertyTypeToActionDictionaryFactoryMap = {
  [CLASSIFICATIONS.TRBL]: TrblPropertyFormatter,
  [CLASSIFICATIONS.UNORDERED_OPTIONAL_TUPLE]: UnorderedOptionalListPropertyFormatter,
  [CLASSIFICATIONS.COMMA_SEPARATED_LIST]: CommaSeparatedListPropertyFormatter,
  [CLASSIFICATIONS.FLEX]: FlexPropertyFormatter,
  [CLASSIFICATIONS.BORDER_RADIUS]: BorderRadiusPropertyFormatter,
  [CLASSIFICATIONS.BACKGROUND]: BackgroundPropertyFormatter,
  [CLASSIFICATIONS.FONT]: FontPropertyFormatter,
};
const R_BLOCK_COMMENT = /\/\*.*?\*\//g;

/**
 * Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
 * mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
 * is not a shorthand property) simply returns an object mapping the original property to the original value.
 *
 * @param {string} propertyName - the property name for the given value
 * @param {string} propertyValue - the value of the property
 * @param {boolean} [recursivelyResolve=false] - recursively resolve additional longhand properties if the shorthands
 *                                              expand to additional shorthands. For example, the border property
 *                                              expands to border-width, which expands further to border-left-width,
 *                                              border-right-width, etc.
 * @return {Object} - object mapping longhand property names to values
 *
 * @throws {ParseError} - if the propertyValue cannot be parsed.
 * @throws {UnknownPropertyError} - if the propertyName is not defined in mdn.
 * @throws {UnsupportedPropertyError} - if the propertyName is a shorthand property, but we don't support expanding it
 *                                      yet.
 *
 * @example
 * expandShorthandProperty('margin', '0 3px 10rem')
 *  {
 *    'margin-top': '0',
 *    'margin-right': '3px',
 *    'margin-bottom': '10rem',
 *    'margin-left': '3px',
 *   }
 *
 * @example
 * expandShorthandProperty('flex', 'initial')
 * {
 *  'flex-grow': 'initial',
 *  'flex-shrink': 'initial',
 *  'flex-basis': 'initial',
 * }
 * TODO: add another param to include initial values for values not set
 */
module.exports = function expandShorthandProperty(propertyName, propertyValue, recursivelyResolve = false) {
  if (!properties[propertyName]) {
    throw new UnknownPropertyError(propertyName);
  } else if (!isShorthandProperty(propertyName)) {
    return { [propertyName]: propertyValue };
  } else if (!SHORTHAND_IDENT_TO_LONGHAND_PROPERTY_MAP[propertyName]) {
    throw new UnsupportedPropertyError(propertyName);
  } else if (CSS_CONSTANTS.globalValues.includes(propertyValue)) {
    return getShorthandComputedProperties(propertyName).reduce((propertyMap, computedPropertyName) => (
      Object.assign({ [computedPropertyName]: propertyValue }, propertyMap)
    ), {});
  }

  // get the compiled grammar file for this property
  // eslint-disable-next-line import/no-dynamic-require
  const grammar = require(`${PATHS.GENERATED_JS_GRAMMAR_PATH}${propertyName}`);
  // remove any block style comments and extra whitespace
  const formattedPropertyValue = propertyValue.replace(R_BLOCK_COMMENT, ' ').replace(/\s+/g, ' ').trim();
  let parser;

  // attempt to parse the css value, using the property specific parser
  try {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)).feed(formattedPropertyValue);
  } catch (parseError) {
    throw new ParseError(`'Error parsing shorthand property ${propertyName}: ${propertyValue}. ${parseError.message}`);
  }

  // get the first parsing and use the formatter for the specific shorthand type for this property
  const [rootNode] = parser.results;
  LocationIndexTracker.reset();
  const shorthandType = shorthandProperties[propertyName].shorthandType;
  const propertyExpansion = shorthandPropertyTypeToActionDictionaryFactoryMap[shorthandType]
    .format(propertyName, rootNode, formattedPropertyValue);

  // if we need to recursively resolve, go through each value and expand it.
  return recursivelyResolve ? Object.entries(propertyExpansion)
      .reduce((propertyExpansion, [name, value]) => (
        Object.assign(expandShorthandProperty(name, value, true), propertyExpansion)
      ), propertyExpansion)
    : propertyExpansion;
};
