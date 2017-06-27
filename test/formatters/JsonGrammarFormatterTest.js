const fs = require('fs-extra');
const { assert } = require('chai');
const ohm = require('ohm-js');
const PATHS = require('../../src/constants/paths');
const JsonGrammarFormatter = require('../../src/formatters/JsonGrammarFormatter');

/**
 * Tests for {@link JsonGrammarFormatter}
 */
describe('JsonGrammarFormatter#formatFormalSyntax', function () {
  const grammarContents = fs.readFileSync(`${PATHS.FORMAL_SYNTAX_GRAMMAR_PATH}/formalSyntax.ohm`);
  const formalSyntaxGrammar = ohm.grammar(grammarContents);
  const jsonGrammarFormatter = new JsonGrammarFormatter(formalSyntaxGrammar);

  const tests = [
    {
      args: ['display-inside', 'flow | flow-root | table | flex | grid | subgrid | ruby'],
      expected: [['__base__', '"flow" | "flow-root" | "table" | "flex" | "grid" | "subgrid" | "ruby"']],
    },
    {
      args: ['angle-percentage', '<angle> | <percentage>'],
      expected: [
        ['__base__', '<angle> | <percentage>'],
        ['<angle>'],
        ['<percentage>'],
      ],
    },
    {
      args: ['attr()', 'attr( <attr-name> <type-or-unit>? [, <attr-fallback> ]? )'],
      expected: [
        ['__base__', '"attr(" <attr-name> <type-or-unit>? ( "," <attr-fallback> )? ")"'],
        ['<attr-name>'],
        ['<type-or-unit>'],
        ['<attr-fallback>'],
      ],
    },
    {
      args: ['bg-size', '[ <length-percentage> | auto ]{1,2} | cover | contain'],
      expected: [
        ['__base__', '( <length-percentage> | "auto" ) ( <length-percentage> | "auto" )? | "cover" | "contain"'],
        ['<length-percentage>'],
      ],
    },
    {
      args: ['side-or-corner', '[ left | right ] || [ top | bottom ]'],
      expected: [
        ['__base__', 'UnorderedOptionalTuple< sideOrCornerIntermediateRule0 , sideOrCornerIntermediateRule1 >'],
        ['sideOrCornerIntermediateRule0', '( "left" | "right" )'],
        ['sideOrCornerIntermediateRule1', '( "top" | "bottom" )'],
      ],
    },
  ];

  tests.forEach(({ args, expected }) => {
    it(`${args[0]}`, function () {
      assert.deepEqual(jsonGrammarFormatter.formatFormalSyntax(...args), expected);
    });
  });
});
