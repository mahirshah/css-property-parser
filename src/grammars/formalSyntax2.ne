@builtin "whitespace.ne"
@builtin "number.ne"
@builtin "string.ne"

Exp ->  SingleBar {% id %}

Asterisk -> Exp "*" {% function (d) { return { nodeName: 'Asterisk', values: [d[0]] }; } %}
          | Plus {% id %}

Plus -> Exp "+" {% function (d) { return { nodeName: 'Plus', values: [d[0]] }; } %}
        | QuestionMark {% id %}

QuestionMark -> Exp "?" {% function (d) { return { nodeName: 'QuestionMark', values: [d[0]] }; } %}
              | CurlyHash {% id %}

CurlyHash -> Exp "#{" unsigned_int "}" {% function (d) { return { nodeName: 'CurlyHash', values: [d[0], d[2]] }; } %}
            | CurlyBraces {% id %}

CurlyBraces -> Exp "{" unsigned_int _ ",":? _ unsigned_int:? "}" {% function (d) { return { nodeName: 'CurlyBraces', values: [d[0], d[2], d[4], d[6]] }; } %}
              | HashMark {% id %}

HashMark -> Exp "#" {% function (d) { return { nodeName: 'HashMark', values: [d[0]] }; } %}

SingleBar -> ( SingleBar __ "|" __ DoubleBar ) {% function (d) {
                                                  return {
                                                    nodeName: 'SingleBar',
                                                    values: [d[0][0], d[0][4]],
                                                  };
                                                } %}
            | DoubleBar {% id %}

DoubleBar -> ( DoubleBar __ "||" __ DoubleAmpersand ) {% function (d) {
                                                        return {
                                                          nodeName: 'DoubleBar',
                                                          values: [d[0][0], d[0][4]],
                                                        };
                                                      } %}
            | DoubleAmpersand {% id %}

DoubleAmpersand -> ( DoubleAmpersand __ "&&" __ Juxtaposition ) {% function (d) {
                                                                  return {
                                                                    nodeName: 'DoubleAmpersand',
                                                                    values: [d[0][0], d[0][4]],
                                                                  };
                                                                } %}
                   | Juxtaposition {% id %}

Juxtaposition -> ( Juxtaposition __ Exp ) {% function (d) {
                                                   return {
                                                     nodeName: 'Juxtaposition',
                                                     values: [d[0][0], d[0][2]],
                                                   };
                                                 } %}
                 | Brackets {% id %}

Brackets -> "[" _ Exp _ "]" {% function (d) {
                                return {
                                  nodeName: 'Brackets',
                                  values: [d[2]],
                                };
                              } %}
          | Asterisk {% id %}
          | node {% id %}
          | dataName {% id %}
          | quotedLiteral {% id %}

node -> "<" "'":? nodeName "'":? ">" {% function (d) {
  return {
    nodeName: 'node',
    values: [d.length === 5 ? d[2] : d[1]],
  };
} %}
nodeName -> [a-zA-Z0-9\-()]:+ {% function (d) { return d[0].join('') } %}
dataName -> (_ [a-zA-Z0-9@\-(),/{}:;%]:+ _) {% function (d) { return `"${d[0].join('')}"`; } %}
quotedLiteral -> sqstring {% function (d) { return d[0].join(''); } %}
