const { assert } = require('chai');
const getShorthandComputedProperties = require('../src/getShorthandComputedProperties');

/**
 * Tests for {@link getShorthandComputedProperties}
 */
describe('getShorthandComputedProperties', function () {
  it('should return an empty array for an unknown property', function () {
    assert.deepEqual(getShorthandComputedProperties('foo'), []);
  });

  it('should return an empty array for a non shorthand property', function () {
    assert.deepEqual(getShorthandComputedProperties('color'), ['color']);
  });

  it('should return an array of computed properties for background', function () {
    assert.deepEqual(getShorthandComputedProperties('background'), [
      'background-image',
      'background-position',
      'background-size',
      'background-repeat',
      'background-origin',
      'background-clip',
      'background-attachment',
      'background-color',
    ]);
  });

  it('should not recursively resolve properties by default', function () {
    assert.deepEqual(getShorthandComputedProperties('border'), [
      'border-width',
      'border-style',
      'border-color',
    ]);
  });

  it('should recursively resolve properties', function () {
    assert.deepEqual(getShorthandComputedProperties('border', true), [
      'border-width',
      'border-style',
      'border-color',
      'border-bottom-width',
      'border-left-width',
      'border-right-width',
      'border-top-width',
      'border-bottom-style',
      'border-left-style',
      'border-right-style',
      'border-top-style',
      'border-bottom-color',
      'border-left-color',
      'border-right-color',
      'border-top-color',
    ]);
  });
});
