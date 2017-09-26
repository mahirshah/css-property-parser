export = CssPropertyParser;

declare namespace CssPropertyParser {
  interface Declarations {
    [property: string]: string;
  }

  /**
   * Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
   * mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
   * is not a shorthand property) simply returns an object mapping the original property to the original value.
   *
   * @param {string} propertyName - the property name for the given value
   * @param {string} propertyValue - the value of the property
   * @param {boolean} [recursivelyResolve=true] - recursively resolve additional longhand properties if the shorthands
   *                                              expand to additional shorthands. For example, the border property
   *                                              expands to border-width, which expands further to border-left-width,
   *                                              border-right-width, etc.
   */
  function expandShorthandProperty(
    propertyName: string,
    propertyValue: string,
    recursivelyResolve?: boolean
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
  *   to border-left-width, border-right-width, etc.
  * @returns {Array} - an array containing the computed properties for the given
  *   shorthand property. Returns an empty array if the given property is not a
  *   valid property.
  */
  function getShorthandComputedProperties(
    shorthandProperty: string,
    recursivelyResolve: boolean
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
