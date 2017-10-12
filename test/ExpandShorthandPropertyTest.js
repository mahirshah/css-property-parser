const { assert } = require('chai');
const expandShorthandProperty = require('../src/expandShorthandProperty');
const { ParseError, UnsupportedPropertyError, UnknownPropertyError } = require('../src/errors');

/**
 * Tests for {@link expandShorthandProperty}
 */
describe('expandShorthandProperty', function () {
  describe('errors', function () {
    it('should throw unknown property error for property not defined in mdn', function () {
      assert.throws(expandShorthandProperty.bind(null, 'margin-l', ''), UnknownPropertyError);
    });

    it('should throw unsupported property error for property that is not in shorthand to longhand ident map', function () {
      assert.throws(expandShorthandProperty.bind(null, 'grid-template', ''), UnsupportedPropertyError);
    });

    it('should throw parse error for value that cannot be parsed', function () {
      assert.throws(expandShorthandProperty.bind(null, 'margin', '1px aaa2123a'), ParseError);
    });
  });

  describe('expand properties with block style comments', function () {
    it('should return expanded 1 block style comment', function () {
      const result = expandShorthandProperty('margin', '0 /* abc */ 3px 10rem');

      assert.deepEqual(result, {
        'margin-top': '0',
        'margin-right': '3px',
        'margin-bottom': '10rem',
        'margin-left': '3px',
      });
    });

    it('should return expanded many block style comment', function () {
      const result = expandShorthandProperty('margin', '/***abc**/ 0 /* abc */ 3px /*a*/ 10rem /* end comment */');

      assert.deepEqual(result, {
        'margin-top': '0',
        'margin-right': '3px',
        'margin-bottom': '10rem',
        'margin-left': '3px',
      });
    });
  });

  describe('margin', function () {
    it('should return expanded for 1 property', function () {
      const result = expandShorthandProperty('margin', '4px');

      assert.deepEqual(result, {
        'margin-top': '4px',
        'margin-right': '4px',
        'margin-bottom': '4px',
        'margin-left': '4px',
      });
    });

    it('should return expanded for 2 properties', function () {
      const result = expandShorthandProperty('margin', '0 auto');

      assert.deepEqual(result, {
        'margin-top': '0',
        'margin-right': 'auto',
        'margin-bottom': '0',
        'margin-left': 'auto',
      });
    });

    it('should return expanded for 3 properties', function () {
      const result = expandShorthandProperty('margin', '0 3px 10rem');

      assert.deepEqual(result, {
        'margin-top': '0',
        'margin-right': '3px',
        'margin-bottom': '10rem',
        'margin-left': '3px',
      });
    });

    it('should return expanded for 4 properties', function () {
      const result = expandShorthandProperty('margin', 'auto 1px 3px 2em');

      assert.deepEqual(result, {
        'margin-top': 'auto',
        'margin-right': '1px',
        'margin-bottom': '3px',
        'margin-left': '2em',
      });
    });

    ['initial', 'unset', 'inherit'].forEach(globalValue => it(`should exand ${globalValue}`, function () {
      const result = expandShorthandProperty('margin', globalValue);

      assert.deepEqual(result, {
        'margin-top': globalValue,
        'margin-right': globalValue,
        'margin-bottom': globalValue,
        'margin-left': globalValue,
      });
    }));
  });

  describe('padding', function () {
    it('should expand 1px', function () {
      const result = expandShorthandProperty('padding', '1px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '1px',
        'padding-bottom': '1px',
        'padding-left': '1px',
      });
    });

    it('should expand 1px 2px', function () {
      const result = expandShorthandProperty('padding', '1px 2px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '2px',
        'padding-bottom': '1px',
        'padding-left': '2px',
      });
    });

    it('should expand 1px 2px 3px', function () {
      const result = expandShorthandProperty('padding', '1px 2px 3px');

      assert.deepEqual(result, {
        'padding-top': '1px',
        'padding-right': '2px',
        'padding-bottom': '3px',
        'padding-left': '2px',
      });
    });

    it('should expand 1px 2px 3px 4px', function () {
      const result = expandShorthandProperty('padding', '1px 2px 3px 4px');

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
      const result = expandShorthandProperty('border', '1px solid black');

      assert.deepEqual(result, {
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': 'black',
      });
    });

    it('should return expanded border with color, width, style', function () {
      const result = expandShorthandProperty('border', 'black 1px solid');

      assert.deepEqual(result, {
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': 'black',
      });
    });

    it('should return expanded border with style, color', function () {
      const result = expandShorthandProperty('border', 'solid black');

      assert.deepEqual(result, {
        'border-style': 'solid',
        'border-color': 'black',
      });
    });

    it('should return expanded border with style, color with recursively resolved properties', function () {
      const result = expandShorthandProperty('border', 'solid black', true);

      assert.deepEqual(result, {
        'border-style': 'solid',
        'border-color': 'black',
        'border-bottom-style': 'solid',
        'border-left-style': 'solid',
        'border-right-style': 'solid',
        'border-top-style': 'solid',
        'border-bottom-color': 'black',
        'border-right-color': 'black',
        'border-left-color': 'black',
        'border-top-color': 'black',
      });
    });

    it('should return expanded border with just color', function () {
      const result = expandShorthandProperty('border', 'black');

      assert.deepEqual(result, {
        'border-color': 'black',
      });
    });
  });

  describe('border-color', function () {
    it('should return expanded border-color', function () {
      const result = expandShorthandProperty('border-color', 'rgba(0, 0, 0, .2)');

      assert.deepEqual(result, {
        'border-bottom-color': 'rgba(0, 0, 0, .2)',
        'border-right-color': 'rgba(0, 0, 0, .2)',
        'border-left-color': 'rgba(0, 0, 0, .2)',
        'border-top-color': 'rgba(0, 0, 0, .2)',
      });
    });
  });

  describe('flex-flow', function () {
    it('should return expanded flex with just flex-direction', function () {
      const result = expandShorthandProperty('flex-flow', 'row-reverse');

      assert.deepEqual(result, {
        'flex-direction': 'row-reverse',
      });
    });

    it('should return expanded flex with just flex-wrap', function () {
      const result = expandShorthandProperty('flex-flow', 'nowrap');

      assert.deepEqual(result, {
        'flex-wrap': 'nowrap',
      });
    });

    it('should return expanded flex with flex-direction flex-wrap', function () {
      const result = expandShorthandProperty('flex-flow', 'column nowrap');

      assert.deepEqual(result, {
        'flex-direction': 'column',
        'flex-wrap': 'nowrap',
      });
    });

    it('should return expanded flex with flex-wrap flex-direction', function () {
      const result = expandShorthandProperty('flex-flow', 'nowrap column');

      assert.deepEqual(result, {
        'flex-direction': 'column',
        'flex-wrap': 'nowrap',
      });
    });
  });

  describe('list-style', function () {
    it('should return expanded list-style with just type', function () {
      const result = expandShorthandProperty('list-style', 'square');

      assert.deepEqual(result, {
        'list-style-type': 'square',
      });
    });

    it('should return expanded list-style with just image', function () {
      const result = expandShorthandProperty('list-style', "url('../img/dino.png')");

      assert.deepEqual(result, {
        'list-style-image': "url('../img/dino.png')",
      });
    });

    it('should return expanded list-style with just position', function () {
      const result = expandShorthandProperty('list-style', 'inside');

      assert.deepEqual(result, {
        'list-style-position': 'inside',
      });
    });

    it('should return expanded list-style with type position', function () {
      const result = expandShorthandProperty('list-style', 'georgian inside');

      assert.deepEqual(result, {
        'list-style-type': 'georgian',
        'list-style-position': 'inside',
      });
    });

    it('should return expanded list-style with just type image position', function () {
      const result = expandShorthandProperty('list-style', "lower-roman url('../img/dino.png') outside");

      assert.deepEqual(result, {
        'list-style-type': 'lower-roman',
        'list-style-position': 'outside',
        'list-style-image': "url('../img/dino.png')",
      });
    });
  });

  describe('outline', function () {
    it('should expand 1px solid #000', function () {
      const result = expandShorthandProperty('outline', '1px solid #000');

      assert.deepEqual(result, { 'outline-width': '1px', 'outline-style': 'solid', 'outline-color': '#000' });
    });

    it('should expand solid 1px #000', function () {
      const result = expandShorthandProperty('outline', 'solid 1px #000');

      assert.deepEqual(result, { 'outline-width': '1px', 'outline-style': 'solid', 'outline-color': '#000' });
    });

    it('should expand solid #000000 1px', function () {
      const result = expandShorthandProperty('outline', 'solid #000000 1px');

      assert.deepEqual(result, { 'outline-width': '1px', 'outline-style': 'solid', 'outline-color': '#000000' });
    });

    it('should expand solid', function () {
      const result = expandShorthandProperty('outline', 'solid');

      assert.deepEqual(result, { 'outline-style': 'solid' });
    });

    it('should expand black', function () {
      const result = expandShorthandProperty('outline', 'black');

      assert.deepEqual(result, { 'outline-color': 'black' });
    });

    it('should expand 1px', function () {
      const result = expandShorthandProperty('outline', '1px');

      assert.deepEqual(result, { 'outline-width': '1px' });
    });
  });


  describe('transition', function () {
    it('should return expanded transition for name duration', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
      });
    });

    it('should return expanded transition for name duration delay', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
      });
    });

    it('should return expanded transition for name duration delay timing-function delay', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s ease-in-out 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
        'transition-timing-function': 'ease-in-out',
      });
    });

    it('should return expanded transition for cubic-bezier timing function', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s cubic-bezier(0.1, 0.7, 1.0, 0.1) 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
        'transition-timing-function': 'cubic-bezier(0.1,0.7,1.0,0.1)',
      });
    });

    it('should return expanded transition for steps timing function with 2 params', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s steps(5, end) 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
        'transition-timing-function': 'steps(5,end)',
      });
    });

    it('should return expanded transition for steps timing function with 1 param', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s steps(5) 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
        'transition-timing-function': 'steps(5)',
      });
    });

    it('should return expanded transition for frames timing function', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s frames(10) 1s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left',
        'transition-duration': '4s',
        'transition-delay': '1s',
        'transition-timing-function': 'frames(10)',
      });
    });

    it('should return expanded for list separated value', function () {
      const result = expandShorthandProperty('transition', 'margin-left 4s, color 1s, border 2s, padding 5s');

      assert.deepEqual(result, {
        'transition-property': 'margin-left, color, border, padding',
        'transition-duration': '4s, 1s, 2s, 5s',
      });
    });

    it('should return expanded for all', function () {
      const result = expandShorthandProperty('transition', 'all 0.5s ease-out');

      assert.deepEqual(result, {
        'transition-property': 'all',
        'transition-duration': '0.5s',
        'transition-timing-function': 'ease-out',
      });
    });
  });


  describe('animation', function () {
    it('should expand @keyframes duration | timing-function | delay | iteration-count | direction | fill-mode | play-state | name', function () {
      const result = expandShorthandProperty('animation', '3s ease-in 1s 2 reverse both paused slidein');

      assert.deepEqual(result, {
        'animation-duration': '3s',
        'animation-timing-function': 'ease-in',
        'animation-delay': '1s',
        'animation-iteration-count': '2',
        'animation-direction': 'reverse',
        'animation-fill-mode': 'both',
        'animation-play-state': 'paused',
        'animation-name': 'slidein',
      });
    });

    it('should expand @keyframes duration | cubic-bezier | delay | infinite iteration-count | direction | fill-mode | play-state | name.', function () {
      const result = expandShorthandProperty('animation', '300ms cubic-bezier(0.1, -0.6, 0.2, 0) 1s infinite alternate-reverse both paused slidein');

      assert.deepEqual(result, {
        'animation-duration': '300ms',
        'animation-timing-function': 'cubic-bezier(0.1,-0.6,0.2,0)',
        'animation-delay': '1s',
        'animation-iteration-count': 'infinite',
        'animation-direction': 'alternate-reverse',
        'animation-fill-mode': 'both',
        'animation-play-state': 'paused',
        'animation-name': 'slidein',
      });
    });

    it('should expand @keyframes duration | timing-function | delay | name', function () {
      const result = expandShorthandProperty('animation', '3s linear 1s slidein');

      assert.deepEqual(result, {
        'animation-duration': '3s',
        'animation-timing-function': 'linear',
        'animation-delay': '1s',
        'animation-name': 'slidein',
      });
    });

    it('should expand @keyframes duration | name', function () {
      const result = expandShorthandProperty('animation', '3s slidein');

      assert.deepEqual(result, {
        'animation-duration': '3s',
        'animation-name': 'slidein',
      });
    });

    it('should handle comma separated list of animations', function () {
      const result = expandShorthandProperty('animation', '3s linear 1s slidein,1s cubic-bezier(0.1, -0.6, 0.2, 0) 2s slideout, 2s ease 2s slide');

      assert.deepEqual(result, {
        'animation-duration': '3s, 1s, 2s',
        'animation-timing-function': 'linear, cubic-bezier(0.1,-0.6,0.2,0), ease',
        'animation-delay': '1s, 2s, 2s',
        'animation-name': 'slidein, slideout, slide',
      });
    });
  });


  describe('flex', function () {
    it('should expand auto', function () {
      const result = expandShorthandProperty('flex', 'auto');

      assert.deepEqual(result, {
        'flex-grow': '1',
        'flex-shrink': '1',
        'flex-basis': 'auto',
      });
    });

    it('should expand initial', function () {
      const result = expandShorthandProperty('flex', 'initial');

      assert.deepEqual(result, {
        'flex-grow': 'initial',
        'flex-shrink': 'initial',
        'flex-basis': 'initial',
      });
    });

    it('should expand none', function () {
      const result = expandShorthandProperty('flex', 'none');

      assert.deepEqual(result, {
        'flex-grow': '0',
        'flex-shrink': '0',
        'flex-basis': 'auto',
      });
    });

    it('should expand single number', function () {
      const result = expandShorthandProperty('flex', '2');

      assert.deepEqual(result, {
        'flex-grow': '2',
        'flex-shrink': '1',
        'flex-basis': '0',
      });
    });

    it('should expand one value, width/height: flex-basis', function () {
      const result = expandShorthandProperty('flex', '10em');

      assert.deepEqual(result, {
        'flex-basis': '10em',
      });
    });

    it('should expand one value, width/height: flex-basis keyword', function () {
      const result = expandShorthandProperty('flex', 'content');

      assert.deepEqual(result, {
        'flex-basis': 'content',
      });
    });

    it('should expand two values: flex-grow | flex-basis', function () {
      const result = expandShorthandProperty('flex', '1 30px');

      assert.deepEqual(result, {
        'flex-grow': '1',
        'flex-basis': '30px',
      });
    });

    it('should expand two values: flex-grow | flex-shrink', function () {
      const result = expandShorthandProperty('flex', '2 2');

      assert.deepEqual(result, {
        'flex-grow': '2',
        'flex-shrink': '2',
      });
    });

    it('should expand three values: flex-grow | flex-shrink | flex-basis', function () {
      const result = expandShorthandProperty('flex', '2 2 10%');

      assert.deepEqual(result, {
        'flex-grow': '2',
        'flex-shrink': '2',
        'flex-basis': '10%',
      });
    });
  });

  describe('border-radius', function () {
    it('should expand radius is set for all 4 sides', function () {
      const result = expandShorthandProperty('border-radius', '10px');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px',
        'border-top-right-radius': '10px',
        'border-bottom-left-radius': '10px',
        'border-bottom-right-radius': '10px',
      });
    });

    it('should expand top-left-and-bottom-right | top-right-and-bottom-left', function () {
      const result = expandShorthandProperty('border-radius', '10px 5%');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px',
        'border-top-right-radius': '5%',
        'border-bottom-left-radius': '5%',
        'border-bottom-right-radius': '10px',
      });
    });

    it('should expand top-left | top-right-and-bottom-left | bottom-right', function () {
      const result = expandShorthandProperty('border-radius', '2px 4px 3px');

      assert.deepEqual(result, {
        'border-top-left-radius': '2px',
        'border-top-right-radius': '4px',
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '3px',
      });
    });

    it('should expand top-left | top-right | bottom-right | bottom-left', function () {
      const result = expandShorthandProperty('border-radius', '1px 0 3px 4px');

      assert.deepEqual(result, {
        'border-top-left-radius': '1px',
        'border-top-right-radius': '0',
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '3px',
      });
    });

    it('should expand (first radius values) / radius', function () {
      const result = expandShorthandProperty('border-radius', '10px 5% / 20px');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5% / 20px',
        'border-bottom-left-radius': '5% / 20px',
        'border-bottom-right-radius': '10px / 20px',
      });
    });

    it('should expand (first radius values) / top-left-and-bottom-right | top-right-and-bottom-left', function () {
      const result = expandShorthandProperty('border-radius', '10px 5% / 20px 30px');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5% / 30px',
        'border-bottom-left-radius': '5% / 30px',
        'border-bottom-right-radius': '10px / 20px',
      });
    });

    it('should expand (first radius values) / top-left | top-right-and-bottom-left | bottom-right', function () {
      const result = expandShorthandProperty('border-radius', '10px 5px 2em / 20px 25px 30%');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5px / 25px',
        'border-bottom-left-radius': '5px / 25px',
        'border-bottom-right-radius': '2em / 30%',
      });
    });

    it('should expand (first radius values) / top-left | top-right | bottom-right | bottom-left', function () {
      const result = expandShorthandProperty('border-radius', '10px 5% / 20px 25em 30px 35em');

      assert.deepEqual(result, {
        'border-top-left-radius': '10px / 20px',
        'border-top-right-radius': '5% / 25em',
        'border-bottom-left-radius': '5% / 35em',
        'border-bottom-right-radius': '10px / 30px',
      });
    });
  });

  describe('border-*', function () {
    ['top', 'right', 'bottom', 'left'].forEach(borderPosition => describe(`border-${borderPosition}`, function () {
      it('should return expanded border with width, style, color', function () {
        const result = expandShorthandProperty(`border-${borderPosition}`, '1px solid black');

        assert.deepEqual(result, {
          [`border-${borderPosition}-width`]: '1px',
          [`border-${borderPosition}-style`]: 'solid',
          [`border-${borderPosition}-color`]: 'black',
        });
      });

      it('should return expanded border with color, width, style', function () {
        const result = expandShorthandProperty(`border-${borderPosition}`, 'black 1px solid');

        assert.deepEqual(result, {
          [`border-${borderPosition}-width`]: '1px',
          [`border-${borderPosition}-style`]: 'solid',
          [`border-${borderPosition}-color`]: 'black',
        });
      });

      it('should return expanded border with style, color', function () {
        const result = expandShorthandProperty(`border-${borderPosition}`, 'solid black');

        assert.deepEqual(result, {
          [`border-${borderPosition}-style`]: 'solid',
          [`border-${borderPosition}-color`]: 'black',
        });
      });

      it('should return expanded border with just color', function () {
        const result = expandShorthandProperty(`border-${borderPosition}`, 'black');

        assert.deepEqual(result, {
          [`border-${borderPosition}-color`]: 'black',
        });
      });
    }));
  });

  describe('background', function () {
    it('should expand using a <background-color>', function () {
      const result = expandShorthandProperty('background', 'green');

      assert.deepEqual(result, {
        'background-color': 'green',
      });
    });

    it('should expand using a <bg-image> and <repeat-style>', function () {
      const result = expandShorthandProperty('background', 'url("test.jpg") repeat-y');

      assert.deepEqual(result, {
        'background-image': 'url("test.jpg")',
        'background-repeat': 'repeat-y',
      });
    });

    it('should expand using a <bg-image> and double <repeat-style>', function () {
      const result = expandShorthandProperty('background', 'url("test.jpg") repeat space');

      assert.deepEqual(result, {
        'background-image': 'url("test.jpg")',
        'background-repeat': 'repeat space',
      });
    });

    it('should expand using a <box> and <background-color>', function () {
      const result = expandShorthandProperty('background', 'border-box red');

      assert.deepEqual(result, {
        'background-origin': 'border-box',
        'background-clip': 'border-box',
        'background-color': 'red',
      });
    });

    it('should expand double repeat', function () {
      const result = expandShorthandProperty('background', 'no-repeat repeat');

      assert.deepEqual(result, {
        'background-repeat': 'no-repeat repeat',
      });
    });

    it('should expand double position', function () {
      const result = expandShorthandProperty('background', 'left 10px');

      assert.deepEqual(result, {
        'background-position': 'left 10px',
      });
    });

    it('should expand background position double size', function () {
      const result = expandShorthandProperty('background', '10% / auto 10px');

      assert.deepEqual(result, {
        'background-position': '10%',
        'background-size': 'auto 10px',
      });
    });

    it('should expand all properties', function () {
      const result = expandShorthandProperty('background', 'fixed padding-box url(image.png) rgb(255, 255, 0) 10px top / cover repeat-x');

      assert.deepEqual(result, {
        'background-attachment': 'fixed',
        'background-clip': 'padding-box',
        'background-origin': 'padding-box',
        'background-image': 'url(image.png)',
        'background-repeat': 'repeat-x',
        'background-color': 'rgb(255, 255, 0)',
        'background-position': '10px top',
        'background-size': 'cover',
      });
    });

    it('should expand using a double <box>', function () {
      const result = expandShorthandProperty('background', 'border-box padding-box red');

      assert.deepEqual(result, {
        'background-origin': 'border-box',
        'background-clip': 'padding-box',
        'background-color': 'red',
      });
    });

    it('should expand a single image, centered and scaled', function () {
      const result = expandShorthandProperty('background', 'no-repeat center/80% url("../img/image.png")');

      assert.deepEqual(result, {
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': '80%',
        'background-image': 'url("../img/image.png")',
      });
    });

    it('should expand 2 layers', function () {
      const result = expandShorthandProperty('background', 'no-repeat center/80% url("../img/image.png"), green');

      assert.deepEqual(result, {
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': '80%',
        'background-image': 'url("../img/image.png")',
        'background-color': 'green',
      });
    });

    it('should expand 3 layers', function () {
      const result = expandShorthandProperty('background', 'no-repeat center/80% url("../img/image.png"), green');

      assert.deepEqual(result, {
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': '80%',
        'background-image': 'url("../img/image.png")',
        'background-color': 'green',
      });
    });
  });

  describe('font', function () {
    ['caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar']
      .forEach(systemKeyword => it(`should expand system system keyword, ${systemKeyword}, to empty object`, function () {
        const result = expandShorthandProperty('font', systemKeyword);

        assert.deepEqual(result, {});
      }));

    it('should expand 16px sans-serif', function () {
      const result = expandShorthandProperty('font', '16px sans-serif');

      assert.deepEqual(result, { 'font-size': '16px', 'font-family': 'sans-serif' });
    });

    it('should expand 16px sans-serif, "Times New Roman"', function () {
      const result = expandShorthandProperty('font', '16px sans-serif, "Times New Roman"');

      assert.deepEqual(result, { 'font-size': '16px', 'font-family': 'sans-serif, "Times New Roman"' });
    });

    it('should expand 16px / 1.2 sans-serif', function () {
      const result = expandShorthandProperty('font', '16px / 1.2 sans-serif');

      assert.deepEqual(result, { 'font-size': '16px', 'line-height': '1.2', 'font-family': 'sans-serif' });
    });

    it('should expand bold 16px sans-serif', function () {
      const result = expandShorthandProperty('font', 'bold 16px sans-serif');

      assert.deepEqual(result, { 'font-weight': 'bold', 'font-size': '16px', 'font-family': 'sans-serif' });
    });

    it('should expand normal 16px sans-serif', function () {
      const result = expandShorthandProperty('font', 'normal 16px sans-serif');

      assert.deepEqual(result, { 'font-weight': 'normal', 'font-size': '16px', 'font-family': 'sans-serif' });
    });

    it('should expand italic 16px sans-serif', function () {
      const result = expandShorthandProperty('font', 'italic 16px sans-serif');

      assert.deepEqual(result, { 'font-style': 'italic', 'font-size': '16px', 'font-family': 'sans-serif' });
    });

    it('should expand small-caps 16px sans-serif', function () {
      const result = expandShorthandProperty('font', 'small-caps 16px sans-serif');

      assert.deepEqual(result, { 'font-variant': 'small-caps', 'font-size': '16px', 'font-family': 'sans-serif' });
    });

    it('should expand ultra-condensed 16px sans-serif', function () {
      const result = expandShorthandProperty('font', 'ultra-condensed 16px sans-serif');

      assert.deepEqual(result, {
        'font-stretch': 'ultra-condensed',
        'font-size': '16px',
        'font-family': 'sans-serif',
      });
    });

    it('should expand oblique 500 small-caps semi-expanded 20% / 2em monospace, "Times New Roman", Helvetica', function () {
      const result = expandShorthandProperty('font', 'oblique 500 small-caps semi-expanded 20% / 2em monospace, "Times New Roman", "Helvetica"');

      assert.deepEqual(result, {
        'font-size': '20%',
        'line-height': '2em',
        'font-style': 'oblique',
        'font-weight': '500',
        'font-variant': 'small-caps',
        'font-stretch': 'semi-expanded',
        'font-family': 'monospace, "Times New Roman", "Helvetica"',
      });
    });

    it('should expand inherit', function () {
      const result = expandShorthandProperty('font', 'inherit');

      assert.deepEqual(result, {
        'font-size': 'inherit',
        'line-height': 'inherit',
        'font-style': 'inherit',
        'font-weight': 'inherit',
        'font-variant': 'inherit',
        'font-stretch': 'inherit',
        'font-family': 'inherit',
      });
    });
  });

  describe('include initial values', function () {
    it('should include initial values for font', function () {
      const result = expandShorthandProperty('font', 'ultra-condensed 16px sans-serif', true, true);

      assert.deepEqual(result, {
        'font-family': 'sans-serif',
        'font-size': '16px',
        'font-stretch': 'ultra-condensed',
        'font-style': 'normal',
        'font-variant': 'normal',
        'font-weight': 'normal',
        'line-height': 'normal',
      });
    });

    it('should include initial values for border', function () {
      const result = expandShorthandProperty('border', '1px', true, true);

      assert.deepEqual(result, {
        'border-bottom-color': 'currentcolor',
        'border-bottom-style': 'none',
        'border-bottom-width': '1px',
        'border-left-color': 'currentcolor',
        'border-left-style': 'none',
        'border-left-width': '1px',
        'border-right-color': 'currentcolor',
        'border-right-style': 'none',
        'border-right-width': '1px',
        'border-top-color': 'currentcolor',
        'border-top-style': 'none',
        'border-top-width': '1px',
        'border-width': '1px',
      });
    });
  });
});
