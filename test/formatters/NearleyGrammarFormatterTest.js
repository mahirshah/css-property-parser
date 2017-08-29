const sinon = require('sinon');
const fs = require('fs-extra');
const { assert } = require('chai');
const PATHS = require('../../src/constants/paths');
const GRAMMAR_CONSTANTS = require('../../src/constants/grammars');
const NearleyGrammarFormatter = require('../../src/formatters/grammarFormatters/NearleyGrammarFormatter');

/**
 * Tests for {@link NearleyGrammarFormatter}
 */
describe('NearleyGrammarFormatter#format', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('simple base key conversions', function () {
    it('should convert base key correctly', function () {
      const result = NearleyGrammarFormatter.format([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '( "test" )'],
      ], 'test');

      assert.equal(result, '@builtin "whitespace.ne"\n@{%\n  const lexer = require("../../../constants/genericLexer");\n%}\n\n@lexer lexer\n\n\nBase -> ( "test" )');
    });
  });

  describe('rule body conversion', function () {
    it('should convert kebab to pascal case', function () {
      const result = NearleyGrammarFormatter.format([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '( <test-test> )'],
      ], 'test');

      assert.equal(result, '@builtin "whitespace.ne"\n@{%\n  const lexer = require("../../../constants/genericLexer");\n%}\n\n@lexer lexer\n\n\nBase -> ( TestTest )');
    });

    it('should convert kebab with parens to pascal case with Func prefix', function () {
      const result = NearleyGrammarFormatter.format([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '( <test-test()> )'],
      ], 'test');

      assert.equal(result, '@builtin "whitespace.ne"\n@{%\n  const lexer = require("../../../constants/genericLexer");\n%}\n\n@lexer lexer\n\n\nBase -> ( TestTestFunc )');
    });

    it('should not do any conversion with tokens', function() {
      const result = NearleyGrammarFormatter.format([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '( <test-test()> %customIdent )'],
      ], 'test');

      assert.equal(result, '@builtin "whitespace.ne"\n@{%\n  const lexer = require("../../../constants/genericLexer");\n%}\n\n@lexer lexer\n\n\nBase -> ( TestTestFunc %customIdent )');
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

      const result = NearleyGrammarFormatter.format([
        [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, '<ra>'],
        ['<ra>'],
      ], 'r');

      assert.equal(result, '@builtin "whitespace.ne"\n@{%\n  const lexer = require("../../../constants/genericLexer");\n%}\n\n@lexer lexer\n\n\n' +
        'Base -> Ra\n' +
        'Ra -> Rb\n' +
        'Rb -> Rc\n' +
        'Rc -> "d"');
    });

    it('should filter out duplicate recursively resolved keys', function () {

    });
  });
});
