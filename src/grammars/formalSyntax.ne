@builtin "whitespace.ne"
@builtin "number.ne"
@builtin "string.ne"

Exp ->  SingleBar {% id %}
      | Brackets {% id %}

SingleBar -> ( SingleBar __ "|" __ DoubleBar ) {% function (d) {  return `${d[0][0]} | ${d[0][4]}` } %}
            | DoubleBar {% id %}

DoubleBar -> ( DoubleBar __ "||" __ DoubleAmpersand ) {% function(d) {
                                                          return `( ( ${d[0][0]} __ ${d[0][4]}? ) | ( ${d[0][4]} __ ${d[0][0]}? ) )`;
                                                      } %}
            | DoubleAmpersand {% id %}

DoubleAmpersand -> ( DoubleAmpersand __ "&&" __ Juxtaposition ) {% function(d) {
                                                                    return `( ( ${d[0][0]} __ ${d[0][4]} ) | ( ${d[0][4]} __ ${d[0][0]} ) )`;
                                                                } %}
                   | Juxtaposition {% id %}

Juxtaposition -> ( Juxtaposition __ nodeName ) {% function(d) {
                                                   return `( ${d[0][0]} __ ${d[0][4]} )`;
                                               } %}
                 | Brackets {% id %}
                 | node {% id %}
                 | dataName {% id %}
                 | quotedLiteral {% id %}

Brackets -> "[" _ Exp _ "]" {%  function(d) { return ` ( ${d[0][2]} )`; }  %}

node -> "<" "'":? nodeName "'":? ">" {% function (d) { return d.length === 5 ? d[2] : d[1]; } %}
nodeName -> [a-zA-Z0-9\-()]:+ {% function (d) { return d[0].join('') } %}
dataName -> [a-zA-Z0-9@\-(),/{}:;%]:+ {% function (d) { return `"${d[0].join('')}"`; } %}
quotedLiteral -> sqstring {% function (d) { return d; } %}
