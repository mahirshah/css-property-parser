const properties = require('./formatted-data/properties.json');
const getShorthandComputedProperties = require('./getShorthandComputedProperties');
const isShorthandProperty = require('./isShorthandProperty');

/**
 * Initial values are highly cacheable since they are just a function of the
 * css specification so this module stores all values in a singleton. By
 * default we cache initial values lazily when each property's initial value is
 * first requested. A function `computeInitialValues` is provided to warm the
 * entire cache on demand if needed.
 *
 * In addition, the data for initial values is incomplete or ambiguous
 * per the spec so we synthesize initial values for shorthand properties.
 * The values chosen are typical values that developers use when disabling
 * a set of properties via shorthand.
 *
 * Since initial values are ambiguous, the `isInitialValue` function
 * is provided as a public api. It's in a different file because it
 * depends on file that depends on this one and circular dependencies
 * are bad.
 */

/**
 * Map of property names to the initial string value for that property.
 * @type {Object}
 */
const initialValueMap = {};

/**
 * These fix broken or bad data and allows us to set a different
 * initial value if we want to.
 */
const initialValueOverrides = {
   // border-image-outset is set to `0s` in the data which is invalid. The
   // ILLEGAL_INITIAL_VALUES regex can't be used because here because that can
   // be a legal initial value for some properties.
  'border-image-outset': '0',
};

/**
 * Map of property names all the properties
 * that it sets, including itself and other shorthands.
 * @type {Object}
 */
const initialValueRecursiveMap = {};

/**
 * Map of property names to concrete longhand initial values. (no intermediate
 * shorthands) This is a subset of the values stored in
 * `initialValueRecursiveMap` and supports the `includeShorthands` property of
 * the `initialValues` function when it is set to false.
 * @type {Object}
 */
const initialValueConcreteMap = {};

const canonicalShorthandInitialValues = {
  border: 'none',
  'border-color': 'currentcolor',
  'border-style': 'none',
  'border-width': 'medium',
  'border-left': 'none',
  'border-right': 'none',
  'border-top': 'none',
  'border-bottom': 'none',
  transition: 'all',
  'text-emphasis': 'none',
  'text-decoration': 'none',
  padding: '0',
  outline: 'none',
  offset: 'none',
  mask: 'border-box',
  margin: '0',
  'list-style': 'disc',
  'grid-template': 'none',
  'grid-row': 'auto',
  'grid-gap': '0',
  'grid-column': 'auto',
  'grid-area': 'auto',
  grid: 'none',
  font: 'medium initial',
  'flex-flow': 'row',
  flex: '0 1 auto',
  columns: 'auto',
  'column-rule': 'none',
  'border-radius': '0',
  'border-inline-start': 'medium',
  'border-inline-end': 'none',
  'border-image': 'none',
  'border-block-start': 'none',
  'border-block-end': 'none',
  background: 'none',
  animation: 'none',
  '-webkit-text-stroke': '0',
  '-webkit-mask': 'none',
  '-webkit-border-before': 'none',
  '-moz-outline-radius': '0',
};

/**
 * The mdn data has some quirky values for initial in some cases
 * because they're trying to encode browser differences somehow.
 * It's bad data design, this should be stored in a different property.
 * This regex is a work around to keep that bad data out of our
 * css values.
 */
const ILLEGAL_INITIAL_VALUES = /XUL|UserAgent|Browser|noPracticalInitialValue|startOrNamelessValueIfLTRRightIfRTL/;

/**
 * Warms up the cache for a single property.
 *
 * @private
 * @param {string} propertyName - the property name to warm up.
 * @returns {void} this function runs for its side effects only.
 */
function computeInitialValue(propertyName) {
  if (properties[propertyName] === undefined) return; // unknown property
  if (initialValueMap[propertyName]) return; // value is cached.
  let initialValue = properties[propertyName].initial;
  if (Array.isArray(initialValue)) {
    // it's a shorthand
    initialValue.forEach(computeInitialValue);
    initialValueMap[propertyName] =
      canonicalShorthandInitialValues[propertyName]
      || initialValue.map(v => initialValueMap[v]).join(' ');
  } else {
    // it's a string with the initial value.
    // the value may be nonsense though.
    if (ILLEGAL_INITIAL_VALUES.test(initialValue)) {
      initialValue = 'initial'; // safest legal value.
    }
    initialValueMap[propertyName] =
      initialValueOverrides[propertyName] || initialValue;
  }
  const propertyNames = getShorthandComputedProperties(propertyName, true);
  initialValueRecursiveMap[propertyName] = { [propertyName]: initialValueMap[propertyName] };
  initialValueConcreteMap[propertyName] = { };
  // In theory, the recursive calls to `computeInitialValue` above should be
  // enough to populate the cache for these calls. However, in the case of data
  // corruption of the initial property this could be a bad assumption.
  propertyNames.forEach((prop) => {
    initialValueRecursiveMap[propertyName][prop] = initialValueMap[prop];
    if (!isShorthandProperty(prop)) {
      initialValueConcreteMap[propertyName][prop] = initialValueMap[prop];
    }
  });
}

/**
 * Warms up the initial value cache for all known css properties.
 * It is not usually necessary to call this function but
 * may be useful in some performance testing scenarios.
 * @return {void} runs for side-effects only.
 */
function computeInitialValues() {
  Object.keys(properties).forEach(computeInitialValue);
}

/**
 * Get the initial values for a property.
 * @param {string} property - the property name
 * @param {boolean} recursivelyResolve - when given a shorthand property,
 *   causes the result to include long hand values.
 * @param {boolean} includeShorthands - when resolving recursively, causes the
 *   the result to include the specified shorthand property as well as any
 *   intermediate shorthands of this property to to the initial value.
 * @return {Object} the initial value or values a property has by
 *   default according the CSS specification. If the property's initial
 *   value(s) is/are unknown, the global keyword `initial` is returned.
 * @example
 *   console.log(initialValues('border-width'));
 *   // => { 'border-width': 'medium' }
 *   console.log(initialValues('border-width', true));
 *   // => {
 *     'border-bottom-width': 'medium',
 *     'border-left-width': 'medium',
 *     'border-right-width': 'medium',
 *     'border-top-width': 'medium',
 *     'border-width': 'medium'
 *   }
 */
function initialValues(property, recursivelyResolve = false, includeShorthands = false) {
  computeInitialValue(property);
  if (recursivelyResolve) {
    const initials = includeShorthands ? initialValueRecursiveMap[property] : initialValueConcreteMap[property];
    if (!initials) {
      // It's an unknown property, return initial and hope the caller knows what
      // they are doing.
      return { [property]: 'initial' };
    }
    // we make a copy here to prevent the caller from corrupting our cache.
    return Object.assign({}, initials);
  }
  return { [property]: initialValueMap[property] || 'initial' };
}

/**
 * Get the initial value for a property. the property can be a shorthand or a
 * longhand.
 * @param {string} property - the property name
 * @return {string} the initial value has by default according the CSS
  * specification. If the property's initial value is unknown, the global
  * keyword `initial` is returned.
 * @example
 *   console.log(initialValue('border-width'));
 *   // => 'medium'
 */
function initialValue(property) {
  computeInitialValue(property);
  return initialValueMap[property] || 'initial';
}

module.exports = {
  computeInitialValues,
  initialValues,
  initialValue,
};
