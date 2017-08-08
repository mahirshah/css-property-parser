const sinon = require('sinon');
const fs = require('fs-extra');
const { assert } = require('chai');
const PATHS = require('../../src/constants/paths');
const GRAMMAR_CONSTANTS = require('../../src/constants/grammars');
const OhmGrammarFormatter = require('../../src/formatters/grammarFormatters/OhmGrammarFormatter');

/**
 * Tests for {@link OhmGrammarFormatter}
 */
describe('OhmGrammarFormatter#formatOhmGrammarFromJson', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('simple base key conversions', function () {
    it('should convert base key correctly', function () {
      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '( "test" )'],
      ], 'test');

      assert.equal(result, '@builtin "whitespace.ne"\n\nBase -> ( "test" ) {% function (d,l) { return { name: \'Base\', values: d.filter(Boolean), l }; }  %}');
    });
  });

  describe('recursive cases', function () {
    it('should handle deeply recursive cases', function () {
      sandbox.stub(fs, 'readJsonSync')
        .withArgs(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}ra.json`)
        .returns([
          [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '<rb>'],
          ['<rb>'],
        ])
        .withArgs(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}rb.json`)
        .returns([
          [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '<rc>'],
          ['<rc>'],
        ])
        .withArgs(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}rc.json`)
        .returns([
          [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '"d"'],
        ]);

      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '<ra>'],
        ['<ra>'],
      ], 'r');

      assert.equal(result, '@builtin "whitespace.ne"\n\nBase -> Ra {% function (d,l) { return { name: \'Base\', values: d.filter(Boolean), l }; }  %}\nRa -> Rb {% id  %}\nRb -> Rc {% id  %}\nRc -> "d" {% id  %}');
    });

    it('should filter out duplicate recursively resolved keys', function () {

    });
  });

  describe('real use cases', function () {
    it('should handle hexColor', function () {
      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '( "#" ( eight | six | four | three ) )'],
        ['three', 'hexDigit hexDigit hexDigit'],
        ['four', 'hexDigit hexDigit hexDigit hexDigit'],
        ['six', 'hexDigit hexDigit hexDigit hexDigit hexDigit hexDigit'],
        ['eight', 'hexDigit hexDigit hexDigit hexDigit hexDigit hexDigit hexDigit hexDigit'],
        ['hexDigit', '[0-9A-Fa-f]'],
      ], 'hexColor');

      assert.equal(result, '');
    });

    it('should handle number', function () {
      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        ['__base__', 'float | exponent'],
        ['float', '"float"'],
        ['exponent', '"exponent"'],
      ], 'number');

      assert.equal(result, 'number {\n  exp = number_float | number_exponent\n  number_float = "float"\n  number_exponent = "exponent"\n}');
    });

    it('should handle angle', function () {
      sandbox.stub(fs, 'readJsonSync')
        .withArgs(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}angle-unit.json`)
        .returns([[
          '__base__', '"deg" | "grad" | "rad" | "turn"',
        ]])
        .withArgs(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}number.json`)
        .returns([
          ['__base__', 'float | scientific'],
          ['float', '(("+"| "-")? digit* "."? digit+)'],
          ['scientific', '(("+"| "-")? digit* "."? digit+ "e" "-"? digit+)'],
        ]);

      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        ['__base__', '<number> <angle-unit>'],
        ['<number>'],
        ['<angle-unit>'],
      ], 'angle');

      assert.equal(result, 'angle {\n  exp = number angleUnit\n  number = number_float | number_scientific\n  number_float = (("+"| "-")? digit* "."? digit+)\n  number_scientific = (("+"| "-")? digit* "."? digit+ "e" "-"? digit+)\n  angleUnit = "deg" | "grad" | "rad" | "turn"\n}');
    });
  });
});
