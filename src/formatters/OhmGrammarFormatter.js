const CaseConverterUtils = require('../utils/CaseConverterUtils');
const fs = require('fs-extra');
const PATHS = require('../constants/paths');
const GRAMMAR_CONSTANTS = require('../constants/grammars');

const BASE_GRAMMAR_FORMATTER_MAP = {
  [GRAMMAR_CONSTANTS.LEXICAL_BASE_KEY]: 'exp',
  [GRAMMAR_CONSTANTS.SYNTACTIC_BASE_KEY]: 'Exp',
};

/**
 * Class to format a JSON Grammar into an Ohm Grammar
 * @type {OhmGrammarFormatter}
 */
module.exports = class OhmGrammarFormatter {
  /**
   * Given a JSON grammar format it into an Ohm Grammar string.
   * See https://github.com/harc/ohm/blob/master/doc/syntax-reference.md for more information on Ohm Syntax.
   *
   * @param {Array} jsonGrammar - json structure representing a grammar
   * @param {string} grammarName - the name of the grammar. Will be used as the name in the outputted Ohm grammar.
   * @returns {string} - the formatted Ohm Grammar string
   */
  static formatOhmGrammarFromJson(jsonGrammar, grammarName) {
    OhmGrammarFormatter._isGrammarValid(jsonGrammar);

    // get the file name for each grammar that needs to be pulled into this grammar. Grab the files for those
    // jsonGrammars and pull in the rule definitions in those jsonGrammars.
    const recursivelyResolvedGrammarArr = OhmGrammarFormatter
      ._getGrammarsToResolve(jsonGrammar)
      .map(fileToResolve => [fileToResolve, fs.readJsonSync(`${PATHS.JSON_GRAMMAR_PATH}${fileToResolve}.json`)])
      .filter(([, json]) => OhmGrammarFormatter._isGrammarValid(json))
      .map(([fileName, json]) => json
        .filter(grammarPair => grammarPair.length === 2) // filter out any jsonGrammars that need resolution
        .map(([ruleName, ruleBody]) => (Object.keys(BASE_GRAMMAR_FORMATTER_MAP).includes(ruleName)
          ? [CaseConverterUtils.formalSyntaxIdentToOhmIdent(`<${fileName}>`), ruleBody]
          : [ruleName, ruleBody])));
    const [baseKey, baseValue] = jsonGrammar[0];
    // the base key for this grammar should be mapped to exp or Exp, then concat the rest of the rules and
    // format them into Ohm syntax. i.e <ruleName> = <ruleBody>.
    const ohmGrammarBody = [[BASE_GRAMMAR_FORMATTER_MAP[baseKey], baseValue]]
      .concat(...recursivelyResolvedGrammarArr)
      .map(([ruleName, ruleBody]) => (
        `  ${ruleName} = ${OhmGrammarFormatter._formatJsonRuleBody(ruleBody)}`
      ))
      .join('\n');

    return `${grammarName} {\n${ohmGrammarBody}\n}`;
  }

  /**
   * Given a json grammar recursively finds all additional jsonGrammars that the grammar depends on. Returns a list
   * of unique file names indicating which jsonGrammars need to be resolved.
   *
   * @param {Array} jsonGrammar - a json structure representing a grammar
   * @returns {Array} - an set of unique file names indicating which jsonGrammars need to resolved.
   * @private
   */
  static _getGrammarsToResolve(jsonGrammar) {
    const resolutions = jsonGrammar
      .filter(grammarLine => grammarLine.length === 1)
      .map(([grammarName]) => GRAMMAR_CONSTANTS.R_GRAMMAR_IDENT.exec(grammarName)[1]);

    if (resolutions.length === 0) {
      return [];
    }

    return [...new Set(resolutions.concat(
      ...resolutions
        .map(file => fs.readJsonSync(`${PATHS.JSON_GRAMMAR_PATH}${file}.json`))
        .map(OhmGrammarFormatter._getGrammarsToResolve)))];
  }

  /**
   * Formats the given rule body into a string that is compatible with Ohm.
   *
   * @param {string} ruleBody - the JSON grammar body
   * @returns {string} - the formatted rule body
   * @private
   */
  static _formatJsonRuleBody(ruleBody) {
    console.log(ruleBody.split(' ').map(CaseConverterUtils.formalSyntaxIdentToOhmIdent));
    return ruleBody.split(' ').map(CaseConverterUtils.formalSyntaxIdentToOhmIdent).join(' ');
  }

  /**
   * Given a grammar json, checks if the grammar is valid.
   *
   * @param {Object} jsonGrammar - a json structure representing a grammar.
   * @returns {boolean} - returns true if given grammar is valid, else throws an error
   * @private
   */
  static _isGrammarValid(jsonGrammar) {
    if (!Array.isArray(jsonGrammar)) {
      throw new Error(`Invalid grammar. Grammar must be a 2-dimensional array:\n${jsonGrammar}`);
    } else if (!jsonGrammar.length) {
      throw new Error(`Invalid grammar. Grammar must be of length >= 1:\n${jsonGrammar}`);
    } else if (!jsonGrammar[0].length || !Object.keys(BASE_GRAMMAR_FORMATTER_MAP).includes(jsonGrammar[0][0])) {
      throw new Error(`Invalid grammar. Grammar must include base key:\n${jsonGrammar}`);
    }

    return true;
  }
};
