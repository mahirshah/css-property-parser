/**
 * Error to be thrown when a property is not supported yet. For example, a longhand property that we do not support
 * yet.
 * @type {module.UnsupportedPropertyError}
 */
module.exports = class UnsupportedPropertyError extends Error {
  constructor(property) {
    super(`Unsupported property error: ${property} is not a supported property`);
    this._property = property;
    Error.captureStackTrace(this, UnsupportedPropertyError);
  }
  get property() {
    return this._property;
  }
};
