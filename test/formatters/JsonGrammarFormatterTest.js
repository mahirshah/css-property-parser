const fs = require('fs-extra');
const { assert } = require('chai');
const ohm = require('ohm-js');
const PATHS = require('../../src/constants/paths');
const JsonGrammarFormatter = require('../../src/formatters/grammarFormatters/JsonGrammarFormatter');

/**
 * Tests for {@link JsonGrammarFormatter}
 */
describe('JsonGrammarFormatter#formatFormalSyntax', function () {
  const grammarContents = fs.readFileSync(`${PATHS.FORMAL_SYNTAX_GRAMMAR_PATH}/formalSyntax.ohm`);
  const formalSyntaxGrammar = ohm.grammar(grammarContents);
  const jsonGrammarFormatter = new JsonGrammarFormatter(formalSyntaxGrammar);

  describe('single bar', function () {
    it('should handle simple or', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo | bar');

      assert.deepEqual(result, [['__Base__', '( "foo" | "bar" )']]);
    });

    it('should not create intermediate rules for terminal nodes', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo | bar | baz');

      assert.deepEqual(result, [['__Base__', '( "foo" | "bar" | "baz" )']]);
    });
  });

  describe('curly', function () {
    it('should handle single number case', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo{3}');

      assert.deepEqual(result, [['__Base__', '"foo" "foo" "foo"']]);
    });

    it('should handle single number with comma case', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo{3,}');

      assert.deepEqual(result, [['__Base__', '"foo" "foo" "foo" "foo"*']]);
    });

    it('should handle both number case', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo{3,5}');

      assert.deepEqual(result, [['__Base__', '"foo" "foo" "foo" "foo"? "foo"?']]);
    });

    it('should handle hash curly case', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo#{3}');

      assert.deepEqual(result, [['__Base__', '"foo" "," "foo" "," "foo"']]);
    });
  });

  describe('double bar', function () {
    it('should handle simple double bar', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo || bar');

      assert.deepEqual(result, [['__Base__', '( "foo" | "bar" )+']]);
    });

    it('should handle complex double bar list', function () {
      const result = jsonGrammarFormatter.formatFormalSyntax('test', 'foo || bar || baz || willow');

      assert.deepEqual(result, [['__Base__', '( "foo" | "bar" | "baz" | "willow" )+']]);
    });
  });

  describe('real use cases', function () {
    const tests = [
      {
        args: ['display-inside', 'flow | flow-root | table | flex | grid | subgrid | ruby'],
        expected: [['__Base__', '( "flow-root" | "subgrid" | "table" | "flow" | "flex" | "grid" | "ruby" )']],
      },
      {
        args: ['angle-percentage', '<angle> | <percentage>'],
        expected: [
          ['__Base__', '( <percentage> | <angle> )'],
          ['<angle>'],
          ['<percentage>'],
        ],
      },
      {
        args: ['attr()', 'attr( <attr-name> <type-or-unit>? [, <attr-fallback> ]? )'],
        expected: [
          ['__Base__', '"attr(" <attr-name> <type-or-unit>? ( "," <attr-fallback> )? ")"'],
          ['<attr-name>'],
          ['<type-or-unit>'],
          ['<attr-fallback>'],
        ],
      },
      {
        args: ['bg-size', '[ <length-percentage> | auto ]{1,2} | cover | contain'],
        expected: [
          ['__Base__', '( IntermediateRule0 | IntermediateRule1 )'],
          ['IntermediateRule0', '( ( <length-percentage> | "auto" ) ) ( ( <length-percentage> | "auto" ) )?'],
          ['IntermediateRule1', '( "contain" | "cover" )'],
          ['<length-percentage>'],
        ],
      },
      {
        args: ['side-or-corner', '[ left | right ] | [ top | bottom ]'],
        expected: [
          ['__Base__', '( IntermediateRule0 | IntermediateRule1 )'],
          ['IntermediateRule0', '( ( "right" | "left" ) )'],
          ['IntermediateRule1', '( ( "bottom" | "top" ) )'],
        ],
      },
      {
        args: ['color-stop-list', '<color-stop>#{2,}'],
        expected: [
          ['__Base__', 'listOf< <color-stop> , "," > listOf< <color-stop> , "," > listOf< <color-stop> , "," >*'],
          ['<color-stop>'],
        ],
      },
    ];

    tests.forEach(({ args, expected }) => {
      it(`should handle ${args[0]}`, function () {
        assert.deepEqual(jsonGrammarFormatter.formatFormalSyntax(...args), expected);
      });
    });
  });
});
