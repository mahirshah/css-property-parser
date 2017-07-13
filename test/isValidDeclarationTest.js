const { assert } = require('chai');
const isValidDeclaration = require('../src/isValidDeclaration');

/**
 * Tests for {@link isValidDeclaration}
 */
describe('isValidDeclaration', function () {
  describe('color', function () {
    ['currentcolor', 'red', 'orange', 'tan', 'rebeccapurple', '#0f0', '#00ff00', '#0f0a',
      '#00ff0080', 'rgb(34, 12, 64, 0.3)', 'rgb(34,12,64,0.3)', 'rgba(34, 12, 64, 0.3)',
      'rgb(34 12 64 / 0.3)', 'rgba(34 12 64 / 0.3)',
      'hsl(30, 100%, 50%, 0.3)', 'hsla(30, 100%, 50%, 0.3)', 'hsl(30 100% 50% / 0.3)',
      'hsla(30 100% 50% / 0.3)', 'inherit', 'initial', 'unset']
    // ['rgba(34 12 64 / 0.3)']
      .forEach((value) => {
        it(`should return true for ${value}`, function () {
          assert(isValidDeclaration('color', value));
        });
      });
  });

  describe('border', function () {
    ['1px', 'solid', 'black', '1px solid', 'solid 1px', '1px solid black', 'medium dashed green', 'green medium dashed']
      .forEach((value) => {
        it(`should return true for ${value}`, function () {
          assert(isValidDeclaration('border', value));
        });
      });
  });

  describe('margin', function () {
    ['0', 'auto', '1px', '1em', '0 auto', '1px 1px', '1px 1em', '20% auto 1px', '20% 1px 20em -2%']
      .forEach((value) => {
        it(`should return true for ${value}`, function () {
          assert(isValidDeclaration('margin', value));
        });
      });
  });

  describe('width', function () {
    ['1px', '2em', '20%', '1vh', '1vw', '20rem', '0']
      .forEach((value) => {
        it(`should return true for ${value}`, function () {
          assert(isValidDeclaration('width', value));
        });
      });
  });

  describe('z-index', function () {
    ['auto', '1', '-1', '-100', '999']
      .forEach((value) => {
        it(`should return true for ${value}`, function () {
          assert(isValidDeclaration('z-index', value));
        });
      });
  });
});
