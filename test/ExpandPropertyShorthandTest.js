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

  describe('padding', function () {
    it('should expand 1px', function () {
      const result = expandPropertyShorthand('padding', '1px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '1px',
        'padding-bottom': '1px',
        'padding-left': '1px',
      });
    });

    it('should expand 1px 2px', function () {
      const result = expandPropertyShorthand('padding', '1px 2px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '2px',
        'padding-bottom': '1px',
        'padding-left': '2px',
      });
    });

    it('should expand 1px 2px 3px', function () {
      const result = expandPropertyShorthand('padding', '1px 2px 3px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '2px',
        'padding-bottom': '3px',
        'padding-left': '2px',
      });
    });

    it('should expand 1px 2px 3px 4px', function () {
      const result = expandPropertyShorthand('padding', '1px 2px 3px 4px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '2px',
        'padding-bottom': '3px',
        'padding-left': '4px',
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

  describe('outline', function () {
    it('should expand 1px solid #000', function () {
      const result = expandPropertyShorthand('outline', '1px solid #000');

      assert.deepEqual(result, { 'outline-width': '1px', 'outline-style': 'solid', 'outline-color': '#000' });
    });

    it('should expand solid 1px #000', function () {
      const result = expandPropertyShorthand('outline', 'solid 1px #000');

      assert.deepEqual(result, { 'outline-width': '1px', 'outline-style': 'solid', 'outline-color': '#000' });
    });

    it('should expand solid #000000 1px', function () {
      const result = expandPropertyShorthand('outline', 'solid #000000 1px');

      assert.deepEqual(result, { 'outline-width': '1px', 'outline-style': 'solid', 'outline-color': '#000000' });
    });

    it('should expand solid', function () {
      const result = expandPropertyShorthand('outline', 'solid');

      assert.deepEqual(result, { 'outline-style': 'solid' });
    });

    it('should expand black', function () {
      const result = expandPropertyShorthand('outline', 'black');

      assert.deepEqual(result, { 'outline-color': 'black' });
    });

    it('should expand 1px', function () {
      const result = expandPropertyShorthand('outline', '1px');

      assert.deepEqual(result, { 'outline-width': '1px' });
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


  describe('flex', function () {
    it('should expand auto', function () {
      const result = expandPropertyShorthand('flex', 'auto');

      assert.deepEqual(result, {
        'flex-grow': '1',
        'flex-shrink': '1',
        'flex-basis': 'auto',
      });
    });

    it('should expand initial', function () {
      const result = expandPropertyShorthand('flex', 'initial');

      assert.deepEqual(result, {
        'flex-grow': '0',
        'flex-shrink': '1',
        'flex-basis': 'auto',
      });
    });

    it('should expand none', function () {
      const result = expandPropertyShorthand('flex', 'none');

      assert.deepEqual(result, {
        'flex-grow': '0',
        'flex-shrink': '0',
        'flex-basis': 'auto',
      });
    });

    it('should expand single number', function () {
      const result = expandPropertyShorthand('flex', '2');

      assert.deepEqual(result, {
        'flex-grow': '2',
        'flex-shrink': '1',
        'flex-basis': '0',
      });
    });

    it('should expand one value, width/height: flex-basis', function () {
      const result = expandPropertyShorthand('flex', '10em');

      assert.deepEqual(result, {
        'flex-basis': '10em',
      });
    });

    it('should expand one value, width/height: flex-basis keyword', function () {
      const result = expandPropertyShorthand('flex', 'content');

      assert.deepEqual(result, {
        'flex-basis': 'content',
      });
    });

    it('should expand two values: flex-grow | flex-basis', function () {
      const result = expandPropertyShorthand('flex', '1 30px');

      assert.deepEqual(result, {
        'flex-grow': '1',
        'flex-basis': '30px',
      });
    });

    it('should expand two values: flex-grow | flex-shrink', function () {
      const result = expandPropertyShorthand('flex', '2 2');

      assert.deepEqual(result, {
        'flex-grow': '2',
        'flex-shrink': '2',
      });
    });

    it('should expand three values: flex-grow | flex-shrink | flex-basis', function () {
      const result = expandPropertyShorthand('flex', '2 2 10%');

      assert.deepEqual(result, {
        'flex-grow': '2',
        'flex-shrink': '2',
        'flex-basis': '10%',
      });
    });
  });

  describe('border-radius', function () {
    it('should expand radius is set for all 4 sides', function () {
      const result = expandPropertyShorthand('border-radius', '10px');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px',
        'border-top-right-radius': '10px',
        'border-bottom-left-radius': '10px',
        'border-bottom-right-radius': '10px',
      });
    });

    it('should expand top-left-and-bottom-right | top-right-and-bottom-left', function () {
      const result = expandPropertyShorthand('border-radius', '10px 5%');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px',
        'border-top-right-radius': '5%',
        'border-bottom-left-radius': '5%',
        'border-bottom-right-radius': '10px',
      });
    });

    it('should expand top-left | top-right-and-bottom-left | bottom-right', function () {
      const result = expandPropertyShorthand('border-radius', '2px 4px 3px');

      assert.deepEqual(result, {
        'border-top-left-radius': '2px',
        'border-top-right-radius': '4px',
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '3px',
      });
    });

    it('should expand top-left | top-right | bottom-right | bottom-left', function () {
      const result = expandPropertyShorthand('border-radius', '1px 0 3px 4px');

      assert.deepEqual(result, {
        'border-top-left-radius': '1px',
        'border-top-right-radius': '0',
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '3px',
      });
    });

    it('should expand (first radius values) / radius', function () {
      const result = expandPropertyShorthand('border-radius', '10px 5% / 20px');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5% / 20px',
        'border-bottom-left-radius': '5% / 20px',
        'border-bottom-right-radius': '10px / 20px',
      });
    });

    it('should expand (first radius values) / top-left-and-bottom-right | top-right-and-bottom-left', function () {
      const result = expandPropertyShorthand('border-radius', '10px 5% / 20px 30px');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5% / 30px',
        'border-bottom-left-radius': '5% / 30px',
        'border-bottom-right-radius': '10px / 20px',
      });
    });

    it('should expand (first radius values) / top-left | top-right-and-bottom-left | bottom-right', function () {
      const result = expandPropertyShorthand('border-radius', '10px 5px 2em / 20px 25px 30%');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5px / 25px',
        'border-bottom-left-radius': '5px / 25px',
        'border-bottom-right-radius': '2em / 30%',
      });
    });

    it('should expand (first radius values) / top-left | top-right | bottom-right | bottom-left', function () {
      const result = expandPropertyShorthand('border-radius', '10px 5% / 20px 25em 30px 35em');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5% / 25em',
        'border-bottom-left-radius': '5% / 35em',
        'border-bottom-right-radius': '10px / 30px',
      });
    });
  });
});
