// TODO: remove all ohm related constants
module.exports = {
  R_GRAMMAR_IDENT_GLOBAL: /<(([^>( ]+)(\(\))?)>/g,
  R_GRAMMAR_IDENT: /<(([^>(]+)(\(\))?)>/,
  R_GRAMMAR_IDENT_NAME_GLOBAL: /(([^>(]+)(\(\))?)/g,
  BASE_GRAMMAR_RULE_NAME: 'Base',
  TOP_LEVEL_NODE_NAME: 'Exp',
  ITERATION_NODE_NAME: '_iter',
  DOUBLE_BAR_LIST_NODE_NAME: 'DoubleBarList',
  SINGLE_BAR_LIST_NODE_NAME: 'SingleBarList',
  GRAMMAR_FILE_EXTENSION: 'ne',
};
