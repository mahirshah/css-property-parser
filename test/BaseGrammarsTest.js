const { assert } = require('chai');
const nearley = require('nearley');

/**
 * Tests for {@link isValidDeclaration}
 */
describe('baseGrammars', function () {
  // TODO: add support for scientific notation
  describe('number', function () {
    const propertyGrammar = require('../src/grammars/generated').number;

    [
      '1',
      '22',
      '200',
      '+1',
      '-1',
      '.4',
      '.5',
      '-.4',
      '+.4',
      '1.0',
      '1.04',
      '12.04',
    ].forEach((val) => {
      it(`should match ${val}`, function () {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(propertyGrammar)).feed(val);

        assert.equal(parser.results.length, 1);
      });
    });
  });

  describe('length', function () {
    const propertyGrammar = require('../src/grammars/generated').length;

    [
      '1px',
      '1em',
      '0',
      '2rem',
    ].forEach((val) => {
      it(`should match ${val}`, function () {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(propertyGrammar)).feed(val);

        assert.equal(parser.results.length, 1);
      });
    });
  });
});
