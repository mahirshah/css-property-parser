/**
 * Error to be thrown when a property is not defined in the mdn properties object.
 * @type {module.UnknownPropertyError}
 */
module.exports = class UnknownPropertyError extends Error {
  constructor(property) {
    super(`Unknown property error: ${property} is not a known property`);
    this._property = property;
    Error.captureStackTrace(this, UnknownPropertyError);
  }
  get property() {
    return this._property;
  }
};
