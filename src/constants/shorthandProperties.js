module.exports = {
  CLASSIFICATIONS: {
    TRBL: 'TRBL',
    COMMA_SEPARATED_LIST: 'COMMA_SEPARATED_LIST',
    UNORDERED_OPTIONAL_TUPLE: 'UNORDERED_OPTIONAL_TUPLE',
    AND_LIST: 'AND_LIST',
    OTHER: 'OTHER',
  },
  R_CLASSIFICATION_MAP: {
    TRBL: /^\[? ?<['a-z-]+> ?(\| <?['a-z-]+>? ?)*]?\{1,4\}$/, // top left bottom right properties
    COMMA_SEPARATED_LIST: /<[a-z-]+>#/, // <ident>#
    UNORDERED_OPTIONAL_TUPLE: /^\[? ?<['a-z-]+> (\|\| <?['a-z-]+>? ?)*]?$/, // <ident> || <ident> || ....
    AND_LIST: /^\[? ?<['a-z-]+> (&& <?['a-z-]+>? ?)*]?$/, // <ident> && <ident> && ...
  },
};
