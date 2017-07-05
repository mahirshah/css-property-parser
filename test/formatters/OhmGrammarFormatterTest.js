const sinon = require('sinon');
const fs = require('fs-extra');
const { assert } = require('chai');
const PATHS = require('../../src/constants/paths');
const OhmGrammarFormatter = require('../../src/formatters/OhmGrammarFormatter');

/**
 * Tests for {@link OhmGrammarFormatter}
 */
describe('OhmGrammarFormatter#formatOhmGrammarFromJson', function () {
  sinon.stub(fs, 'readJsonSync')
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
    ])
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

  const tests = [
    {
      args: [[
        ['__base__', '( "test" )'],
      ], 'test1'],
      expected: 'test1 {\n  exp = ( "test" )\n}',
    },
    {
      args: [[
        ['__Base__', '( "test" )'],
      ], 'test2'],
      expected: 'test2 {\n  Exp = ( "test" )\n}',
    },
    {
      args: [[
        ['__base__', 'float | exponent'],
        ['float', '"float"'],
        ['exponent', '"exponent"'],
      ], 'number'],
      expected: 'number {\n  exp = number_float | number_exponent\n  number_float = "float"\n  number_exponent = "exponent"\n}',
    },
    {
      args: [[
        ['__base__', '<number> <angle-unit>'],
        ['<number>'],
        ['<angle-unit>'],
      ], 'angle'],
      expected: 'angle {\n  exp = number angleUnit\n  number = number_float | number_scientific\n  number_float = (("+"| "-")? digit* "."? digit+)\n  number_scientific = (("+"| "-")? digit* "."? digit+ "e" "-"? digit+)\n  angleUnit = "deg" | "grad" | "rad" | "turn"\n}',
    },
    {
      args: [[
        ['__base__', '<ra>'],
        ['<ra>'],
      ], 'r'],
      expected: 'r {\n  exp = ra\n  ra = rb\n  rb = rc\n  rc = "d"\n}',
    },
  ];

  tests.forEach(({ args, expected }) => {
    it(`${args[1]}`, function () {
      assert.equal(OhmGrammarFormatter.formatOhmGrammarFromJson(...args), expected);
    });
  });
});
