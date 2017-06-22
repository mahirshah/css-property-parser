const isShorthandProperty = require('./isShorthandProperty');

/**
 * Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
 * mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
 * is not a shorthand property) simply returns an object mapping the original property to the original value.
 * @param property - the property name for the given value
 * @param value - the value of the property
 * @param [recursivelyResolve=true] - recursively resolve additional longhand properties if the shorthands
 *                                    expand to additional shorthands. For example, the border property expands to
 *                                    border-width, which expands further to border-left-width, border-right-width, etc.
 *
 * @TODO: add examples here
 * @TODO: allow a way to distinguish between defaults and explicity set values
 */
export default function (property, value, recursivelyResolve = true) {
  if (!isShorthandProperty(property)) {
    return { [property]: value };
  }

  return {};
}