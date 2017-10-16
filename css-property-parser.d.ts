export = CssPropertyParser;

declare namespace CssPropertyParser {
  class ParseError extends Error {
  }
  class UnsupportedPropertyError extends Error {
    readonly property: string;
    constructor(property: string);
  }
  class UnknownPropertyError extends Error {
    readonly property: string;
    constructor(property: string);
  }
  interface Declarations {
    [property: string]: string;
  }

  /**
   * Given a property and value attempts to expand the value into its longhand
   * equivalents. Returns an object mapping the property longhand names to the
   * longhand values. If the property cannot be expanded (i.e. the property is
   * not a shorthand property) simply returns an object mapping the original
   * property to the original value.
   *
   * @param {string} propertyName - the property name for the given value
   * @param {string} propertyValue - the value of the property
   * @param {boolean} [recursivelyResolve=true] - recursively resolve additional
   *   longhand properties if the shorthands expand to additional shorthands. For
   *   example, the border property expands to border-width, which expands
   *   further to border-left-width, border-right-width, etc.
   * @param {boolean} [includeInitialValues=false] - when expanding the shorthand
   *   property, fill in any missing longhand values with their initial value.
   *   For example, the property declaration "border: 1px" only explicitly sets the
   *   "border-width" longhand property. If this param is true, the returned object
   *   will fill in the initial values for "border-style" and "border-color". By
   *   default, the returned object will only contain the "border-width".
   */
  function expandShorthandProperty(
    propertyName: string,
    propertyValue: string,
    recursivelyResolve?: boolean,
    includeInitialValues?: boolean,
  ): Declarations;

 /**
  * Given a shorthand property, returns an array of the computed properties for
  * that shorthand property. If given a known property that is not a shorthand,
  * simply returns the given property. If given an unknown property, returns an
  * empty array.
  *
  * @param {string} shorthandProperty - the shorthand property name. For
  *   example, "background" or "border".
  * @param {boolean} recursivelyResolve - recursively resolve additional
  *   longhand properties if the shorthands expand to additional shorthands. For
  *   example, the border property expands to border-width, which expands further
  *   to border-left-width, border-right-width, etc. Defaults to false.
  * @returns {Array} - an array containing the computed properties for the given
  *   shorthand property. Returns an empty array if the given property is not a
  *   valid property.
  */
  function getShorthandComputedProperties(
    shorthandProperty: string,
    recursivelyResolve?: boolean
  ): Array<string>;

  /**
   * Checks if a given property is a shorthand property
   * @param {String} property - the property name
   * @returns {boolean} - true if property is a shorthand, false otherwise
   */
  function isShorthandProperty(
    shorthandProperty: string
  ): boolean;

  /**
   * Return a list of all properties that set the given property.
   * Includes at least the value provided, plus any other shorthands that can
   * set it.
   */
  function getShorthandsForProperty(
    longhandProperty: string
  ): Array<string>;
  /**
   * Checks if the given property, value pair is valid.
   *
   * @param {String} property - the property name. For example, 'border' or 'color'.
   * @param {String} value - the property value. For example, '1px solid black'.
   * @return {boolean} - true if the given value is valid for the property. Else, false.
   */
  function isValidDeclaration(
    property: string,
    value: string
  ): boolean;

}
