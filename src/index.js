const expandShorthandProperty = require('./expandShorthandProperty');
const getShorthandComputedProperties = require('./getShorthandComputedProperties');
const isShorthandProperty = require('./isShorthandProperty');
const getShorthandsForProperty = require('./getShorthandsForProperty');
const isValidDeclaration = require('./isValidDeclaration');
const {
  ParseError,
  UnsupportedPropertyError,
  UnknownPropertyError,
} = require('./errors');

module.exports = {
  expandShorthandProperty,
  getShorthandComputedProperties,
  isShorthandProperty,
  isValidDeclaration,
  getShorthandsForProperty,
  ParseError,
  UnsupportedPropertyError,
  UnknownPropertyError,
};
