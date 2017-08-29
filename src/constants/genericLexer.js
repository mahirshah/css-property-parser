const moo = require('moo');

module.exports = moo.compile({
  color: /(?:#(?:[0-9a-f]{2}){2,4}|#[0-9a-fA-F]{3}|(?:rgba?|hsla?)\(\s*(?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s/]*[\d.]+%?\s*\))/,
  number: /(?:[+-])?(?:(?:\d+\.\d*)|(?:\d*\.\d+))/,
  integer: /(?:[+-])?[0-9]+/,
  string: /(?:"[^"]")|(?:'[^']')/,
  functionStart: /[a-zA-Z]+\(/,
  customIdent: /[^0-9\s](?:[a-zA-Z0-9_-]|(?:\\.))*/,
  ident: /[a-zA-Z-]+/,
  char: /./,
});
