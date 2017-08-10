const fs = require('fs-extra');
const { PATHS, CSS } = require('./constants');
const isShorthandProperty = require('./isShorthandProperty');
const getShorthandComputedProperties = require('./getShorthandComputedProperties');
const shorthandProperties = require('../formatted-data/shorthand-properties.json');
// const grammar = fs.readFileSync(`${PATHS.GENERATED_NEARLEY_GRAMMAR_PATH}border.ne`, 'utf-8');
const nearley = require('nearley');
// const nearleyMake = require('nearley-make');
const { CLASSIFICATIONS } = require('./constants/shorthandProperties');

// TODO: make index.js for factories and use single require
const UnorderedOptionalListPropertyFormatter = require('./formatters/shorthandPropertyTypeFormatters/UnorderedOptionalListPropertyFormatter');
const TrblPropertyFormatter = require('./formatters/shorthandPropertyTypeFormatters/TrblPropertyFormatter');
const FlexPropertyFormatter = require('./formatters/shorthandPropertyTypeFormatters/FlexPropertyFormatter');
const BorderRadiusPropertyFormatter = require('./formatters/shorthandPropertyTypeFormatters/BorderRadiusPropertyFormatter');
const CommaSeparatedPropertyFormatter = require('./formatters/shorthandPropertyTypeFormatters/CommaSeparatedListPropertyFormatter');
const BackgroundPropertyFormatter = require('./formatters/shorthandPropertyTypeFormatters/BackgroundPropertyFormatter');

const shorthandPropertyTypeToActionDictionaryFactoryMap = {
  [CLASSIFICATIONS.TRBL]: TrblPropertyFormatter,
  [CLASSIFICATIONS.UNORDERED_OPTIONAL_TUPLE]: UnorderedOptionalListPropertyFormatter,
  [CLASSIFICATIONS.COMMA_SEPARATED_LIST]: CommaSeparatedPropertyFormatter,
  [CLASSIFICATIONS.FLEX]: FlexPropertyFormatter,
  [CLASSIFICATIONS.BORDER_RADIUS]: BorderRadiusPropertyFormatter,
  [CLASSIFICATIONS.BACKGROUND]: BackgroundPropertyFormatter,
};

/**
 * Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
 * mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
 * is not a shorthand property) simply returns an object mapping the original property to the original value.
 *
 * @param {string} propertyName - the property name for the given value
 * @param {string} propertyValue - the value of the property
 * @param {boolean} [recursivelyResolve=true] - recursively resolve additional longhand properties if the shorthands
 *                                              expand to additional shorthands. For example, the border property
 *                                              expands to border-width, which expands further to border-left-width,
 *                                              border-right-width, etc.
 * TODO: add another param to include initial values for values not set
 * TODO: add examples here
 * TODO: properly handle parsing errors
 */
module.exports = function expandShorthandProperty(propertyName, propertyValue, recursivelyResolve = true) {
  if (!isShorthandProperty(propertyName)) {
    return { [propertyName]: propertyValue };
  }

  // else if (CSS.globalValues.includes(propertyValue)) {
  //   return getShorthandComputedProperties(propertyName).reduce((propertyMap, computedPropertyName) => (
  //     Object.assign({ [computedPropertyName]: propertyValue }, propertyMap)
  //   ), {});
  // }

  // eslint-disable-next-line import/no-dynamic-require
  const grammar = require(`./grammars/generated/js/${propertyName}`);
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(propertyValue);
  const [rootNode] = parser.results;
  const shorthandType = shorthandProperties[propertyName].shorthandType;

  return shorthandPropertyTypeToActionDictionaryFactoryMap[shorthandType]
    .format(propertyName, rootNode, propertyValue);
};
