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

  /**
   * Given a string in kebab-case, returns the string in PascalCase.
   * @param {string} kebabString - the kebab-case string
   * @returns {string} - the PascalCase string
   */
  static kebabToPascal(kebabString) {
    return kebabString
      .replace(/(-\w)/g, ([, match]) => match.toUpperCase())
      .replace(/^(\w)/, ([match]) => match.toUpperCase());
  }

  /**
   * Takes the given string and capitalizes the first letter
   * @param {string} string - any string
   * @returns {string} - the capitalized string or the empty string if the given string is empty
   */
  static anyToCapitalized(string) {
    return string.length ? `${string[0].toUpperCase()}${string.slice(1)}` : string;
  }

  /**
   * Takes the given string and lowercases the first letter
   * @param {string} string - any string
   * @returns {string} - the lowercased string or the empty string if the given string is empty
   */
  static anyToUnCapitalized(string) {
    return string.length ? `${string[0].toLowerCase()}${string.slice(1)}` : string;
  }

  /**
   * Formats the given formal syntax ident into a string that is compatible with Ohm. Normal kebab-case strings will
   * be camelCased. Strings with a "()" will have "Func" suffix.
   *
   * @example formalSyntaxIdentToNearleyIdent("some-string") -> "someString"
   * @example formalSyntaxIdentToNearleyIdent("some-string()") -> "someStringFunc"
   *
   * @param {string} formalSyntaxIdent - the JSON grammar rule name
   * @returns {string} - the formatted rule name in camelCase/pascalCase format, with an optional Func suffix
   */
  static formalSyntaxIdentToNearleyIdent(formalSyntaxIdent) {
    return formalSyntaxIdent
      .replace(GRAMMAR_CONSTANTS.R_GRAMMAR_IDENT_NAME_GLOBAL, (fullMatch, innerIdent, identName, parens) => (
        `${CaseConverterUtils.kebabToPascal(identName)}${parens ? 'Func' : ''}`
      ));
  }
};
