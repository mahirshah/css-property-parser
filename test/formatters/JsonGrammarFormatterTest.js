const { assert } = require('chai');
const JsonGrammarFormatter = require('../../src/formatters/grammarFormatters/JsonGrammarFormatter');

/**
 * Tests for {@link JsonGrammarFormatter}
 */
describe('JsonGrammarFormatter#formatFormalSyntax', function () {
  describe('single bar', function () {
    it('should handle simple or', function () {
      const result = JsonGrammarFormatter.format('foo | bar');

      assert.deepEqual(result, [['Base', '( "foo" | "bar" )']]);
    });

    it('should not create intermediate rules for terminal nodes', function () {
      const result = JsonGrammarFormatter.format('foo | bar | baz');

      assert.deepEqual(result, [['Base', '( ( "foo" | "bar" ) | "baz" )']]);
    });
  });

  describe('curly', function () {
    it('should handle single number case', function () {
      const result = JsonGrammarFormatter.format('foo{3}');

      assert.deepEqual(result, [['Base', '( "foo" __ "foo" __ "foo" )']]);
    });

    it('should handle single number with comma case', function () {
      const result = JsonGrammarFormatter.format('foo{3,}');

      assert.deepEqual(result, [['Base', '( "foo" __ "foo" __ "foo" ( __ "foo"):* )']]);
    });

    it('should handle both number case', function () {
      const result = JsonGrammarFormatter.format('foo{3,5}');

      assert.deepEqual(result, [['Base', '( "foo" __ "foo" __ "foo" ( __ "foo" ):? ( __ "foo" ):? )']]);
    });

    it('should handle hash curly case', function () {
      const result = JsonGrammarFormatter.format('foo#{3}');

      assert.deepEqual(result, [['Base', '( "foo" _ "," _ "foo" _ "," _ "foo" )']]);
    });
  });

  describe('double bar', function () {
    it('should handle simple double bar', function () {
      const result = JsonGrammarFormatter.format('foo || bar');

      assert.deepEqual(result, [['Base', '( "foo" | "bar" ) ( __ ( "foo" | "bar" ) ):*']]);
    });

    it('should handle complex double bar list', function () {
      const result = JsonGrammarFormatter.format('foo || bar || baz || willow');

      assert.deepEqual(result, [['Base', '( ( "foo" | "bar" | "baz" | "willow" ) ( __ ( "foo" | "bar" | "baz" | "willow" ) ):* )']]);
    });
  });

  describe('real use cases', function () {
    const tests = [
      {
        args: ['flow | flow-root | table | flex | grid | subgrid | ruby'],
        expected: [['Base', '( ( ( ( ( ( "flow" | "flow-root" ) | "table" ) | "flex" ) | "grid" ) | "subgrid" ) | "ruby" )']],
      },
      {
        args: ['<angle> | <percentage>'],
        expected: [
          ['Base', '( <angle> | <percentage> )'],
          ['<angle>'],
          ['<percentage>'],
        ],
      },
      {
        args: ['[ <length-percentage> | auto ]{1,2} | cover | contain'],
        expected: [
          ['Base', '( ( ( ( ( <length-percentage> | "auto" ) ) ( __ ( ( <length-percentage> | "auto" ) ) ):? ) | "cover" ) | "contain" )'],
          ['<length-percentage>'],
        ],
      },
      {
        args: ['[ left | right ] | [ top | bottom ]'],
        expected: [
          ['Base', '( ( ( "left" | "right" ) ) | ( ( "top" | "bottom" ) ) )'],
        ],
      },
      {
        args: ['<color-stop>#{2,}'],
        expected: [
          ['Base', '( <color-stop> _ "," _ <color-stop> ( _ "," _ <color-stop> ):* )'],
          ['<color-stop>'],
        ],
      },
    ];

    tests.forEach(({ args, expected }) => {
      it(`should handle ${args[0]}`, function () {
        assert.deepEqual(JsonGrammarFormatter.format(...args), expected);
      });
    });
  });
});
