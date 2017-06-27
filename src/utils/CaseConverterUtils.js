const GRAMMAR_CONSTANTS = require('../constants/grammars');

/**
 * Class that holds util functions to convert one case to another. All methods should be of form <case>To<case>()
 */
module.exports = class CaseConverterUtils {
  /**
   * Given a string in kebab-case, returns the string in camelCase.
   * @param {string} kebabString - the kebab-case string
   * @return {string} - the camelCase string
   */
  static kebabToCamel(kebabString) {
    return kebabString.replace(/(-\w)/g, ([, match]) => match.toUpperCase());
  }

  /**
   * Given a string in camelCase, returns the string in kebab-case.
   * @param {string} camelString - the camelCase string
   * @return {string} - the kebab-case string
   */
  static camelToKebab(camelString) {
    return camelString.replace(/([A-Z])/g, ([match]) => `-${match.toLowerCase()}`);
  }

  static kebabToPascal(kebabString) {
    return kebabString
      .replace(/(-\w)/g, ([, match]) => match.toUpperCase())
      .replace(/^(\w)/, ([match]) => match.toUpperCase());
  }

  /**
   * Formats the given formal syntax ident into a string that is compatible with Ohm. Normal kebab-case strings will
   * simple be camelCased, while strings with a "()" will have "Func" suffix.
   *
   * @example formalSyntaxIdentToOhmIdent("<some-string>") -> "someString"
   * @example formalSyntaxIdentToOhmIdent("<some-string()>") -> "someStringFunc"
   *
   * @param {string} formalSyntaxIdent - the JSON grammar rule name
   * @returns {string} - the formatted rule name in camelCase format, with an optional Func suffix
   */
  static formalSyntaxIdentToOhmIdent(formalSyntaxIdent) {
    return formalSyntaxIdent.replace(GRAMMAR_CONSTANTS.R_GRAMMAR_IDENT_GLOBAL, (fullMatch, innerIdent, identName, parens) => (
      `${CaseConverterUtils.kebabToCamel(identName)}${parens ? 'Func' : ''}`
    ));
  }
};
