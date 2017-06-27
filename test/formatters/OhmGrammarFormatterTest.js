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
        ['__base__', '<number> <angle-unit>'],
        ['<number>'],
        ['<angle-unit>'],
      ], 'angle'],
      expected: 'angle {\n  exp = number angleUnit\n  number = float | scientific\n  float = (("+"| "-")? digit* "."? digit+)\n  scientific = (("+"| "-")? digit* "."? digit+ "e" "-"? digit+)\n  angleUnit = "deg" | "grad" | "rad" | "turn"\n}',
    },
  ];

  tests.forEach(({ args, expected }) => {
    it(`${args[1]}`, function () {
      assert.equal(OhmGrammarFormatter.formatOhmGrammarFromJson(...args), expected);
    });
  });
});
