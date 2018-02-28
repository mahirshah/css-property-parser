const CaseConverterUtils = require('../../utils/CaseConverterUtils');
const fs = require('fs-extra');
const path = require('path');
const PATHS = require('../../constants/paths');
const GRAMMAR_CONSTANTS = require('../../constants/grammars');
const shorthandIdentToLongHandPropertyMap = require('../../constants/shorthandIdentToLonghandPropertyMap.json');

// any nearley builtin grammars that we want to include
const BUILTIN_GRAMMARS = ['whitespace'];
const LEXER_HEADING = '@{%\n  const lexer = require("../../../constants/genericLexer");\n%}\n\n@lexer lexer\n';

/**
 * Class to format a JSON Grammar into an Nearley Grammar
 * @type {NearleyGrammarFormatter}
 */
module.exports = class NearleyGrammarFormatter {
  /**
   * Given a JSON grammar format it into an Nearley Grammar string. This function, recursively resolves grammar
   * rules defined in the given json grammar. Any intermediate grammar rules are prefixed with the file name in order
   * to avoid rule name collisions between recursively resolved grammar rules.
   * <p>
   * @see {@link https://github.com/Hardmath123/nearley | Nearley Readme} for more information on
   * Nearley Syntax.
   *
   * @param {Array} jsonGrammar - json structure representing a grammar
   * @param {string} grammarName - the name of the property being converted to nearley form. For example, "rgba()"
   * @returns {string} - the formatted Ohm Grammar string
   */
  static format(jsonGrammar, grammarName) {
    NearleyGrammarFormatter._isGrammarValid(jsonGrammar);

    // Create a 2d array from a grammar name to its json grammar. All of these grammars need to be recursively resolved.
    // i.e. [["color", [<jsonGrammarForColor>]], "z-index", [<jsonGrammarForZIndex>]]
    // Then get the file name for each grammar that needs to be pulled into this grammar. Grab the files for those
    // jsonGrammars and pull in the rule definitions in those jsonGrammars.
    const recursivelyResolvedGrammars = NearleyGrammarFormatter
      ._getGrammarsToResolve(jsonGrammar)
      .map(fileToResolve => [
        fileToResolve,
        fs.readJsonSync(path.join(PATHS.GENERATED_JSON_GRAMMAR_PATH, `${fileToResolve}.json`)),
      ])
      .filter(([, json]) => NearleyGrammarFormatter._isGrammarValid(json))
      .map(([grammarName, jsonGrammar]) => (
        [grammarName, NearleyGrammarFormatter._prefixIntermediateGrammarRules(grammarName, jsonGrammar)]
      ))
      .map(([grammarName, json]) => json
        .filter(grammarPair => grammarPair.length === 2) // filter out any jsonGrammars that need resolution
        .map(([ruleName, ruleBody]) => (
          ruleName === GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME
            ? [CaseConverterUtils.formalSyntaxIdentToNearleyIdent(grammarName), ruleBody]
            : [ruleName, ruleBody]
        )));
    const [[, baseValue], ...otherRules] = NearleyGrammarFormatter
      ._prefixIntermediateGrammarRules(grammarName, jsonGrammar);
    // the base key for this grammar should be mapped to Base, then concat the rest of the rules and
    // format them into nearley syntax. i.e <ruleName> -> <ruleBody>.
    const nearleyGrammarBody = [[GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, baseValue]]
      .concat(otherRules.filter(rule => rule.length === 2)) // add any rules that don't need to be resolved
      .concat(...recursivelyResolvedGrammars) // add all the rules we resolved
      .map(([ruleName, ruleBody]) => {
        const ruleBodyString = NearleyGrammarFormatter._formatJsonRuleBody(ruleBody);
        const postProcessorString = this._getPostProcessorString(grammarName, ruleName);

        return postProcessorString
          ? `${ruleName} -> ${ruleBodyString} ${postProcessorString}`
          : `${ruleName} -> ${ruleBodyString}`;
      })
      .join('\n');
    const builtinGrammarsHeader = BUILTIN_GRAMMARS
      .map(grammarName => `@builtin "${grammarName}.${GRAMMAR_CONSTANTS.GRAMMAR_FILE_EXTENSION}"`)
      .join('\n');

    return `${builtinGrammarsHeader}\n${LEXER_HEADING}\n\n${nearleyGrammarBody}`;
  }

  /**
   * Generate a postprocessing string for a given ruleName in the context of grammarName. This postprocessing string
   * is used in a nearley grammar to run code after a specific rule is parsed. We only need to create postprocessing
   * strings for longhand properties we intend to expand from a shorthand prop. All other properties will not have a
   * postprocessing string.
   *
   * @param {string} grammarName - the name of the grammar to generate the post processing string for. For example,
   *                               "border".
   * @param {string} ruleName - the rule name to get the postprocessing string for. For example, "Color".
   * @returns {String} - a string containing the postprocessing function for the given ruleName or an empty string if
   *                     no postprocessing is required
   * @private
   */
  static _getPostProcessorString(grammarName, ruleName) {
    // if its not a shorthand property we don't support, we don't need postprocessing, since we only use the grammar
    // for property validation
    if (!shorthandIdentToLongHandPropertyMap[grammarName]
      || Array.isArray(shorthandIdentToLongHandPropertyMap[grammarName])) {
      return '';
    }

    return Object.keys(shorthandIdentToLongHandPropertyMap[grammarName])
      .concat(GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME)
      .includes(ruleName)
      ? `{% function (data,location) { return { name: '${ruleName}', values: data.filter(Boolean), location }; } %}`
      : '';
  }

  /**
   * Given a json grammar recursively finds all additional jsonGrammars that the grammar depends on. Returns a set
   * of unique file names indicating which jsonGrammars need to be resolved.
   *
   * @param {Array} jsonGrammar - a json structure representing a grammar
   * @param {Array} [resolved=[]] - cached array of grammar names that have already been resolved. Caller does not
   *                                need to use this param, since it only used for recursive grammars.
   * @returns {Array} - a set of unique file names indicating which json grammars need to resolved.
   * @private
   */
  static _getGrammarsToResolve(jsonGrammar, resolved = []) {
    const resolutions = jsonGrammar
      .filter(grammarLine => grammarLine.length === 1)
      .map(([grammarName]) => GRAMMAR_CONSTANTS.R_GRAMMAR_IDENT.exec(grammarName)[1])
      .filter(grammarName => !resolved.includes(grammarName));

    if (resolutions.length === 0) {
      return [];
    }

    return [...new Set(resolutions.concat(
      ...resolutions
        .map(file => fs.readJsonSync(path.join(PATHS.GENERATED_JSON_GRAMMAR_PATH, `${file}.json`)))
        .map(grammar => NearleyGrammarFormatter._getGrammarsToResolve(grammar, resolved.concat(resolutions)))))];
  }

  /**
   * Given a grammarName and a json grammar, prefixes all the intermediate rule names with the grammar name.
   * This is necessary in order to prevent rule name conflicts when recursively resolving grammars.
   * <p>
   * For example, two grammars 'a' and 'b' may contain a rule named 'foo'. If another grammar uses both 'a' and 'b'
   * we need to differentiate between the rule 'foo' defined in both 'a' and 'b'. Thus we prefix 'foo' for both grammars
   * and rename the rules 'a_foo' and 'b_foo'.
   *
   * @param {string} grammarName - the name of the given json grammar. This should be a camelCase name.
   * @param {Array} jsonGrammar - the json grammar to be prefixed
   * @returns {Array} - the prefixed json grammar
   * @private
   */
  static _prefixIntermediateGrammarRules(grammarName, jsonGrammar) {
    // prefix all rules that we don't need to recursively resolve and are not base rules
    const ruleNamesToPrefix = jsonGrammar
      .filter(rule => rule.length === 2)
      .filter(([ruleName]) => ruleName !== GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME)
      .map(([ruleName]) => (
        `(?:[^a-z"](${ruleName})$|^(${ruleName})[^a-z"]|^(${ruleName})$|[^a-z"](${ruleName})[^a-z"])`
      ));

    // iterate through all the rules and replace rule name/rule body with prefixed rule names
    if (ruleNamesToPrefix.length) {
      const ruleNamesToPrefixRegex = new RegExp(`${ruleNamesToPrefix.join('|')}`, 'g');

      return jsonGrammar
        .filter(rule => rule.length === 2)
        .map(rule => rule.map(rulePart => rulePart
          .split(' ')
          .map(ruleExpression => ruleExpression
            .replace(ruleNamesToPrefixRegex, (completeMatch, ...ruleNameMatches) => {
              const ruleName = ruleNameMatches.find(Boolean);

              return completeMatch
                .replace(ruleName, NearleyGrammarFormatter._prefixRuleName(grammarName, ruleName));
            }))
          .join(' ')));
    }

    return jsonGrammar;
  }

  /**
   * Prefixes the given rule name with the grammar name.
   * @param {string} grammarName - the grammar name
   * @param {string} ruleName - the rule name
   * @returns {string} - the prefixed rule name
   * @private
   */
  static _prefixRuleName(grammarName, ruleName) {
    return `${CaseConverterUtils.formalSyntaxIdentToNearleyIdent(grammarName)}_${ruleName}`;
  }

  /**
   * Formats the given rule body into a string that is compatible with Nearley.
   *
   * @param {string} ruleBody - the JSON grammar body
   * @returns {string} - the formatted rule body
   * @private
   */
  static _formatJsonRuleBody(ruleBody) {
    return ruleBody.replace(GRAMMAR_CONSTANTS.R_GRAMMAR_IDENT_GLOBAL, (fullMatch, innerIdent, identName, parens) => {
      const nearleyIdent = CaseConverterUtils.formalSyntaxIdentToNearleyIdent(identName);

      return `${nearleyIdent}${parens ? 'Func' : ''}`;
    });
  }

  /**
   * Given a grammar json, checks if the grammar is valid.
   *
   * @param {Object} jsonGrammar - a json structure representing a grammar.
   * @returns {boolean} - returns true if given grammar is valid, else throws an error
   * @throws {Error} - error indicating why the grammar is invalid
   * @private
   */
  static _isGrammarValid(jsonGrammar) {
    if (!Array.isArray(jsonGrammar)) {
      throw new Error(`Invalid grammar. Grammar must be a 2-dimensional array:\n${jsonGrammar}`);
    } else if (!jsonGrammar.length) {
      throw new Error(`Invalid grammar. Grammar must be of length >= 1:\n${jsonGrammar}`);
    } else if (!jsonGrammar[0][0] === GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME) {
      throw new Error(
        `Invalid grammar. Grammar must have base key: ${GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME}\n${jsonGrammar}`
      );
    }

    return true;
  }
};
