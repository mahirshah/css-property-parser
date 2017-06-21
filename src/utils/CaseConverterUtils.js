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
};
