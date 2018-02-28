const { assert } = require('chai');
const properties = require('../src/formatted-data/properties.json');
const {
   initialValue,
   initialValues,
   isInitialValue,
   isValidDeclaration,
   expandShorthandProperty,
} = require('../src');

/**
 * Tests for {@link initialValues}
 */
describe('Initial values', function () {
  it('are legal values', () => {
    // TODO figure out why these legal values don't validate.
    const buggyValues = new Set([
      'background-position-x',
      'background-position-y',
      'border-radius',
      'border-spacing',
      'cursor',
      'display-inside',
      'display-outside',
      'grid-area',
      'grid-column',
      'grid-gap',
      'grid-row',
      'offset',
      'outline-color',
      'position',
      'transform-box',
    ]);
    Object.keys(properties).forEach((prop) => {
      if (prop.startsWith('-') || buggyValues.has(prop)) return; // bug in grammar data
      let initial = initialValue(prop);
      assert(isValidDeclaration(prop, initial), `${prop}: ${initial} is not a legal initial value`);
    });
  });
  it('expand recursively with intermediate shorthands', () => {
    const values = initialValues('background', true, true);
    assert.deepEqual(values, {
      background: 'none',
      'background-attachment': 'scroll',
      'background-clip': 'border-box',
      'background-color': 'transparent',
      'background-image': 'none',
      'background-origin': 'padding-box',
      'background-position': '0% 0%',
      'background-repeat': 'repeat',
      'background-size': 'auto auto',
    })
  });
  it('expand recursively without intermediate shorthands', () => {
    const values = initialValues('border', true, false);
    assert.deepEqual(values, {
      'border-bottom-color': 'currentcolor',
      'border-bottom-style': 'none',
      'border-bottom-width': 'medium',
      'border-left-color': 'currentcolor',
      'border-left-style': 'none',
      'border-left-width': 'medium',
      'border-right-color': 'currentcolor',
      'border-right-style': 'none',
      'border-right-width': 'medium',
      'border-top-color': 'currentcolor',
      'border-top-style': 'none',
      'border-top-width': 'medium',
    })
  });
  it('can check if a value is an initial value', () => {
    assert(isInitialValue('border-bottom-width', 'medium'));
    assert(isInitialValue('border-bottom-width', 'initial'));
    assert(isInitialValue('border-bottom-width', 'MEDIUM'));
    assert(isInitialValue('padding', '0'));
    assert(isInitialValue('padding', '0px'));
    assert(isInitialValue('padding', '0PX'));
    assert(isInitialValue('padding', '0 0'));
    assert(isInitialValue('padding', '0 0 0 0'));
    assert(isInitialValue('padding', 'initial'));
  });
  it('can check if a value is not an initial value', () => {
    assert(!isInitialValue('border-bottom-width', '1px'));
    assert(!isInitialValue('padding', '1px'));
    assert(!isInitialValue('padding', '2%'));
  });
});