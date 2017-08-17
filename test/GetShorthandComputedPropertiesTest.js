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
});
