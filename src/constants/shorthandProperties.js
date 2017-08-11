module.exports = {
  CLASSIFICATIONS: {
    TRBL: 'TRBL',
    COMMA_SEPARATED_LIST: 'COMMA_SEPARATED_LIST',
    UNORDERED_OPTIONAL_TUPLE: 'UNORDERED_OPTIONAL_TUPLE',
    AND_LIST: 'AND_LIST',
    OTHER: 'OTHER',
    FLEX: 'FLEX',
    BACKGROUND: 'BACKGROUND',
    BORDER_RADIUS: 'BORDER_RADIUS',
    FONT: 'FONT',
  },
  R_CLASSIFICATION_MAP: {
    TRBL: /^\[? ?<['a-z-]+> ?(\| <?['a-z-]+>? ?)*]?\{1,4\}$/, // top left bottom right properties
    COMMA_SEPARATED_LIST: /<[a-z-]+>#/, // <ident>#
    UNORDERED_OPTIONAL_TUPLE: /^\[? ?<['a-z-]+> (\|\| <?['a-z-]+>? ?)*]?$/, // <ident> || <ident> || ....
    AND_LIST: /^\[? ?<['a-z-]+> (&& <?['a-z-]+>? ?)*]?$/, // <ident> && <ident> && ...
  },
  OTHER_PROPERTY_CLASSIFICATION_MAP: {
    FLEX: ['flex'],
    BACKGROUND: ['background'],
    BORDER_RADIUS: ['border-radius'],
    FONT: ['font'],
  },
};
