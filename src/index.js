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
const isInitialValue = require('./isInitialValue');
const {
  computeInitialValues,
  initialValues,
  initialValue,
} = require('./initialValueMap');

module.exports = {
  computeInitialValues,
  expandShorthandProperty,
  getShorthandComputedProperties,
  getShorthandsForProperty,
  initialValue,
  initialValues,
  isInitialValue,
  isShorthandProperty,
  isValidDeclaration,
  ParseError,
  UnsupportedPropertyError,
  UnknownPropertyError,
};
