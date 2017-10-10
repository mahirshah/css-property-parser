const nearley = require('nearley');
const { css: { properties } } = require('mdn-data');
const { CSS } = require('./constants');

/**
 * Checks if the given property, value pair is valid.
 *
 * @param {String} property - the property name. For example, 'border' or 'color'.
 * @param {String} value - the property value. For example, '1px solid black'.
 * @return {boolean} - true if the given value is valid for the property. Else, false.
 */
module.exports = function isValidDeclaration(property, value) {
  if (!properties[property]) {
    return false;
  } else if (CSS.globalValues.includes(value) || CSS.variableRegex.test(value)) {
    return true;
  }

  const propertyGrammar = require('./grammars/generated')[property];

  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(propertyGrammar)).feed(value);
    return !!parser.results.length;
  } catch (parseError) {
    return false;
  }
};
