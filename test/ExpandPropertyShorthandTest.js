const { assert } = require('chai');
const expandPropertyShorthand = require('../src/expandShorthandProperty');

/**
 * Tests for {@link expandPropertyShorthand}
 * TODO: add tests for global values
 */
describe('expandPropertyShorthand', function () {
  describe('margin', function () {
    it('should return expanded for 1 property', function () {
      const result = expandPropertyShorthand('margin', '4px');

      assert.deepEqual(result, {
        'margin-top': '4px',
        'margin-right': '4px',
        'margin-bottom': '4px',
        'margin-left': '4px',
      });
    });

    it('should return expanded for 2 properties', function () {
      const result = expandPropertyShorthand('margin', '0 auto');

      assert.deepEqual(result, {
        'margin-top': '0',
        'margin-right': 'auto',
        'margin-bottom': '0',
        'margin-left': 'auto',
      });
    });

    it('should return expanded for 3 properties', function () {
      const result = expandPropertyShorthand('margin', '0 3px 10rem');

      assert.deepEqual(result, {
        'margin-top': '0',
        'margin-right': '3px',
        'margin-bottom': '10rem',
        'margin-left': '3px',
      });
    });

    it('should return expanded for 4 properties', function () {
      const result = expandPropertyShorthand('margin', 'auto 1px 3px 2em');

      assert.deepEqual(result, {
        'margin-top': 'auto',
        'margin-right': '1px',
        'margin-bottom': '3px',
        'margin-left': '2em',
      });
    });
  });

  describe('border', function () {
    it('should return expanded border with width, style, color', function () {
      const result = expandPropertyShorthand('border', '1px solid black');

      assert.deepEqual(result, {
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': 'black',
      });
    });

    it('should return expanded border with color, width, style', function () {
      const result = expandPropertyShorthand('border', 'black 1px solid');

      assert.deepEqual(result, {
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': 'black',
      });
    });

    it('should return expanded border with style, color', function () {
      const result = expandPropertyShorthand('border', 'solid black');

      assert.deepEqual(result, {
        'border-style': 'solid',
        'border-color': 'black',
      });
    });

    it('should return expanded border with just color', function () {
      const result = expandPropertyShorthand('border', 'black');

      assert.deepEqual(result, {
        'border-color': 'black',
      });
    });
  });

  describe('flex-flow', function () {
    it('should return expanded flex with just flex-direction', function () {
      const result = expandPropertyShorthand('flex-flow', 'row-reverse');

      assert.deepEqual(result, {
        'flex-direction': 'row-reverse',
      });
    });

    it('should return expanded flex with just flex-wrap', function () {
      const result = expandPropertyShorthand('flex-flow', 'nowrap');

      assert.deepEqual(result, {
        'flex-wrap': 'nowrap',
      });
    });

    it('should return expanded flex with flex-direction flex-wrap', function () {
      const result = expandPropertyShorthand('flex-flow', 'column nowrap');

      assert.deepEqual(result, {
        'flex-direction': 'column',
        'flex-wrap': 'nowrap',
      });
    });

    it('should return expanded flex with flex-wrap flex-direction', function () {
      const result = expandPropertyShorthand('flex-flow', 'nowrap column');

      assert.deepEqual(result, {
        'flex-direction': 'column',
        'flex-wrap': 'nowrap',
      });
    });
  });

  // ["square", "url('../img/dino.png')", "inside", "georgian inside", "lower-roman url('../img/dino.png') outside", "none", "inherit", "initial", "unset"]
  describe('list-style', function () {
    it('should return expanded list-style with just type', function () {
      const result = expandPropertyShorthand('list-style', 'sqaure');

      assert.deepEqual(result, {
        'list-style-type': 'sqaure',
      });
    });

    it('should return expanded list-style with just image', function () {
      const result = expandPropertyShorthand('list-style', "url('../img/dino.png')");

      assert.deepEqual(result, {
        'list-style-image': "url('../img/dino.png')",
      });
    });

    it('should return expanded list-style with just position', function () {
      const result = expandPropertyShorthand('list-style', 'inside');

      assert.deepEqual(result, {
        'list-style-position': 'inside',
      });
    });

    it('should return expanded list-style with type position', function () {
      const result = expandPropertyShorthand('list-style', 'georgian inside');

      assert.deepEqual(result, {
        'list-style-type': 'georgian',
        'list-style-position': 'inside',
      });
    });

    it('should return expanded list-style with just type image position', function () {
      const result = expandPropertyShorthand('list-style', "lower-roman url('../img/dino.png') outside");

      assert.deepEqual(result, {
        'list-style-type': 'lower-roman',
        'list-style-position': 'outside',
        'list-style-image': "url('../img/dino.png')",
      });
    });
  });


  describe('transition', function () {
    it('should return expanded transition for name duration', function () {
      const result = expandPropertyShorthand('transition', 'margin-left 4s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
      });
    });

    it('should return expanded transition for name duration delay', function () {
      const result = expandPropertyShorthand('transition', 'margin-left 4s 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
      });
    });

    it('should return expanded transition for name duration delay timing-function delay', function () {
      const result = expandPropertyShorthand('transition', 'margin-left 4s ease-in-out 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
        'transition-timing-function': 'ease-in-out',
      });
    });

    it('should return expanded for list separated value', function () {
      const result = expandPropertyShorthand('transition', 'margin-left 4s, color 1s, border 2s, padding 5s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left, color, border, padding',
        'transition-duration': '4s, 1s, 2s, 5s',
      });
    });

    it('should return expanded for all', function () {
      const result = expandPropertyShorthand('transition', 'all 0.5s ease-out');

      assert.deepEqual(result, {
        'transition-property': 'all',
        'transition-duration': '0.5s',
        'transition-timing-function': 'ease-out',
      });
    });
  });


});
