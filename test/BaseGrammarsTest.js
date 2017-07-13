const { assert } = require('chai');
const ohm = require('ohm-js');
const fs = require('fs-extra');
const { PATHS } = require('../src/constants');


/**
 * Tests for {@link isValidDeclaration}
 */
describe('baseGrammars', function () {
  describe('number', function () {
    const numberGrammarContent = fs.readFileSync(`${PATHS.OHM_GRAMMAR_PATH}number.ohm`);
    const numberGrammar = ohm.grammar(numberGrammarContent);

    ['1', '22', '200', '+1', '-1', '.4', '.5', '-.4', '+.4', '1.0', '1.04', '12.04', '1e3', '12e30', '1.2e31', '+1e3',
      '-1e3']
      .forEach((val) => {
        it(`should match ${val}`, function () {
          assert(numberGrammar.match(val).succeeded());
        });
      });
  });

  describe('length', function () {
    const lengthGrammarContent = fs.readFileSync(`${PATHS.OHM_GRAMMAR_PATH}length.ohm`);
    const lengthGrammar = ohm.grammar(lengthGrammarContent);

    ['1px', '1em', '0', '2rem']
      .forEach((val) => {
        it(`should match ${val}`, function () {
          assert(lengthGrammar.match(val).succeeded());
        });
      });
  });
});
