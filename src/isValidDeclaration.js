/* eslint-disable import/no-dynamic-require */
const nearley = require('nearley');
const fs = require('fs-extra');
// TODO: don't require mdn-data at runtime
const { css: { properties } } = require('mdn-data');
const { PATHS, CSS } = require('./constants');

module.exports = function isValidDeclaration(property, value) {
  if (!properties[property]) {
    return false;
  } else if (CSS.globalValues.includes(value)) {
    return true;
  }

  const propertyGrammar = require(`${PATHS.GENERATED_JS_GRAMMAR_PATH}${property}.js`);

  try {
    const parser = new nearley.Parser(propertyGrammar.ParserRules, propertyGrammar.ParserStart).feed(value);
    return !!parser.results.length;
  } catch (parseError) {
    return false;
  }
};
