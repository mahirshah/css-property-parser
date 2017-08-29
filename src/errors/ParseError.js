/**
 * An error to be thrown when a css value cannot be parsed by nearley.
 * @type {module.ParseError}
 */
module.exports = class ParseError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ParseError);
  }
};