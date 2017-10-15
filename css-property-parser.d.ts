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

  /**
   * Because of the `initial` keyword and shorthand expansion,
   * there are many possible values that are equivalently identical
   * with the initial value of a css property. This function
   * returns true for all possible values that have the effect of
   * setting a property to its initial value.
   *
   * @param property the property to which  the value is assigned
   * @param value the value to check
   * @return whether the value is equivalent to the initial value.
   */
  function isInitialValue(
    property: string,
    value: string
  ): boolean;

  /**
   * Warms up the initial value cache for all known css properties.
   * It is not usually necessary to call this function but
   * may be useful in some performance testing scenarios.
   */
  function computeInitialValues(): void;

  /**
   * Get the initial values for a property.
   * @param property - the property name
   * @param recursivelyResolve - Defaults to false. when given a shorthand property,
   *   causes the result to include long hand values.
   * @param includeShorthands - Defaults to false. when resolving recursively, causes the
   *   the result to include the specified shorthand property as well as any
   *   intermediate shorthands of this property to to the initial value.
   * @return the initial value or values a property has by
   *   default according the CSS specification. If the property's initial
   *   value(s) is/are unknown, the global keyword `initial` is returned.
   */
  function initialValues(
    property: string,
    recursivelyResolve?: boolean,
    includeShorthands?: boolean
  ): Declarations;

  /**
   * Get the initial value for a property. the property can be a shorthand or a
   * longhand.
   * @param property - the property name
   * @return {string} the initial value has by default according the CSS
   * specification. If the property's initial value is unknown, the global
   * keyword `initial` is returned. There's no spec value for shorthands
   * so in those cases, the value returned is not the only legal value that can be returned,
   * instead, it is a value that developers is commonly in practice.
   */
  function initialValue(property: string): string;
}
