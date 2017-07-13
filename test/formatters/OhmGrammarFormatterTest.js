const sinon = require('sinon');
const fs = require('fs-extra');
const { assert } = require('chai');
const PATHS = require('../../src/constants/paths');
const OhmGrammarFormatter = require('../../src/formatters/OhmGrammarFormatter');

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
    it('should convert syntatic base key correctly', function () {
      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        ['__Base__', '( "test" )'],
      ], 'test');

      assert.equal(result, 'test {\n  Exp = ( "test" )\n}');
    });

    it('should convert lexical base key correctly', function () {
      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        ['__base__', '( "test" )'],
      ], 'test');

      assert.equal(result, 'test {\n  exp = ( "test" )\n}');
    });
  });

  describe('recursive cases', function () {
    it('should handle deeply recursive cases', function () {
      sandbox.stub(fs, 'readJsonSync')
        .withArgs(`${PATHS.JSON_GRAMMAR_PATH}ra.json`)
        .returns([
          ['__base__', '<rb>'],
          ['<rb>'],
        ])
        .withArgs(`${PATHS.JSON_GRAMMAR_PATH}rb.json`)
        .returns([
          ['__base__', '<rc>'],
          ['<rc>'],
        ])
        .withArgs(`${PATHS.JSON_GRAMMAR_PATH}rc.json`)
        .returns([
          ['__base__', '"d"'],
        ]);

      const result = OhmGrammarFormatter.formatOhmGrammarFromJson([
        ['__base__', '<ra>'],
        ['<ra>'],
      ], 'r');

      assert.equal(result, 'r {\n  exp = ra\n  ra = rb\n  rb = rc\n  rc = "d"\n}');
    });

    it('should filter out duplicate recursively resolved keys', function () {

    });
  });

  describe('real use cases', function () {
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
        .withArgs(`${PATHS.JSON_GRAMMAR_PATH}angle-unit.json`)
        .returns([[
          '__base__', '"deg" | "grad" | "rad" | "turn"',
        ]])
        .withArgs(`${PATHS.JSON_GRAMMAR_PATH}number.json`)
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
