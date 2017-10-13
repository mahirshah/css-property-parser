const { assert } = require('chai');
const getShorthandsForProperty = require('../src/getShorthandsForProperty.js');
/**
 * Tests for {@link getShorthandsForProperty}
 */
describe('getShorthandsForProperty', function () {
  it('should return an empty array for an unknown property', function () {
    assert.deepEqual(getShorthandsForProperty('foo'), []);
  });

  it('should return itself for a property that has no shorthands', function () {
    assert.deepEqual(getShorthandsForProperty('float'), ['float']);
  });

  it('should return a property when passed a longhand', function () {
    assert.deepEqual(getShorthandsForProperty('background-image'), [
      'background-image',
      'background',
    ]);
  });

  it('should return all shorthands if more than one', function () {
    assert.deepEqual(getShorthandsForProperty('border-left-color'), [
      'border-left-color',
      'border-left',
      'border-color',
      'border',
    ]);
  });
});
