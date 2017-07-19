const ohm = require('ohm-js');
const fs = require('fs-extra');
const { PATHS, CSS } = require('./constants');
const isShorthandProperty = require('./isShorthandProperty');
const getShorthandComputedProperties = require('./getShorthandComputedProperties');
const shorthandProperties = require('../formatted-data/shorthand-properties.json');
const { CLASSIFICATIONS } = require('./constants/shorthandProperties');
// TODO: make index.js for factories and use single require
const TrblActionDictionaryFactory = require('./factories/actionDictionaryFactories/TrblActionDictionaryFactory');
const UnorderedOptionalListActionDictionaryFactory = require('./factories/actionDictionaryFactories/UnorderedOptionalListActionDictionaryFactory');
const CommaSeparatedListActionDictionaryFactory = require('./factories/actionDictionaryFactories/CommaSeparatedListActionDictionaryFactory');

const shorthandPropertyTypeToActionDictionaryFactoryMap = {
  [CLASSIFICATIONS.TRBL]: TrblActionDictionaryFactory,
  [CLASSIFICATIONS.UNORDERED_OPTIONAL_TUPLE]: UnorderedOptionalListActionDictionaryFactory,
  [CLASSIFICATIONS.COMMA_SEPARATED_LIST]: CommaSeparatedListActionDictionaryFactory,
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
 *
 * TODO: add examples here
 */
module.exports = function expandShorthandProperty(propertyName, propertyValue, recursivelyResolve = true) {
  if (!isShorthandProperty(propertyName)) {
    return { [propertyName]: propertyValue };
  } else if (CSS.globalValues.includes(propertyValue)) {
    return getShorthandComputedProperties(propertyName).reduce((propertyMap, computedPropertyName) => (
      Object.assign({ [computedPropertyName]: propertyValue }, propertyMap)
    ), {});
  }

  const propertyGrammarContents = fs.readFileSync(`${PATHS.OHM_GRAMMAR_PATH}${propertyName}.ohm`);
  const propertyGrammar = ohm.grammar(propertyGrammarContents);
  const propertyMatch = propertyGrammar.match(propertyValue);

  if (propertyMatch.succeeded()) {
    const shorthandType = shorthandProperties[propertyName].shorthandType;
    const actionDictionary = shorthandPropertyTypeToActionDictionaryFactoryMap[shorthandType]
      .createActionDictionary(propertyName);
    const propertySemantics = propertyGrammar
      .createSemantics()
      .addOperation('eval', actionDictionary);

    return propertySemantics(propertyMatch).eval();
  }

  return {};
};
