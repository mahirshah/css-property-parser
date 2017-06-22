/**
 * Format each formal syntax into a json grammar
 */
const fs = require('fs-extra');
const ohm = require('ohm-js');
const JsonGrammarFormatter = require('./formatters/JsonGrammarFormatter');


const grammarContents = fs.readFileSync('./src/grammars/formalSyntax.ohm');
const formalSyntaxGrammar = ohm.grammar(grammarContents);
const s = new JsonGrammarFormatter(formalSyntaxGrammar)
  .formatFormalSyntax('background', '<bg-image> || <position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box>{1,2}');
console.log(s);
