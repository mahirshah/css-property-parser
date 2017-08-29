@builtin "whitespace.ne"
@builtin "number.ne"
@builtin "string.ne"

Exp ->  SingleBarList {% id %}


Combinator ->   Brackets "*" {% function (d) { return { nodeName: 'Asterisk', values: [d[0]] }; } %}
             |  Brackets "+" {% function (d) { return { nodeName: 'Plus', values: [d[0]] }; } %}
             |  Brackets "?" {% function (d) { return { nodeName: 'QuestionMark', values: [d[0]] }; } %}
             |  Brackets "{" unsigned_int _ ",":? _ unsigned_int:? "}" {% function (d, l, r) {
                                                                            if(d[0] && d[0].nodeName === 'HashMark') return r;

                                                                            return { nodeName: 'CurlyBraces', values: [d[0], d[2], d[4], d[6]] };
                                                                        } %}
             |  Brackets "#{" unsigned_int _ ",":? "}" {% function (d) { return { nodeName: 'CurlyHash', values: [d[0], d[2], d[4]] }; } %}
             |  Brackets "#" {% function (d) { return { nodeName: 'HashMark', values: [d[0]] }; } %}
             |  terminal {% id %}

SingleBarList -> ( DoubleBarList __ "|" __ ):+ DoubleBarList {% function (d) {
                                                  return {
                                                    nodeName: 'SingleBarList',
                                                    values: [d[0], d[1]],
                                                  };
                                                } %}
            | DoubleBarList {% id %}

DoubleBarList -> (DoubleAmpersand __ "||" __):+ DoubleAmpersand {% function (d) { return { nodeName: 'DoubleBarList', values: [d[0], d[1]] }; } %}
                 | DoubleAmpersand {% id %}

DoubleAmpersand -> ( DoubleAmpersand __ "&&" __ Juxtaposition ) {% function (d) {
                                                                  return {
                                                                    nodeName: 'DoubleAmpersand',
                                                                    values: [d[0][0], d[0][4]],
                                                                  };
                                                                } %}
                   | Juxtaposition {% id %}


Juxtaposition -> ( Juxtaposition __ Comma ) {% function (d) {
                                                   return {
                                                     nodeName: 'Juxtaposition',
                                                     values: [d[0][0], d[0][2]],
                                                   };
                                                 } %}
                 | Comma {% id %}

Comma -> ( Comma _ "," _ terminal ) {% function (d) {
                                     return {
                                       nodeName: 'Comma',
                                       values: [d[0][0], d[0][4]],
                                     };
                                   } %}
        | Brackets {% id %}

Brackets -> "[" _ SingleBarList _ "]" {% function (d) {
                                return {
                                  nodeName: 'Brackets',
                                  values: [d[2]],
                                };
                              } %}
          | Combinator {% id %}


terminal -> "<" "'":? nodeName "'":? ">" {% function (d) {
                                           return {
                                             nodeName: 'node',
                                             values: [d.length === 5 ? d[2] : d[1]],
                                           };
                                         } %}
            | [a-zA-Z0-9@\-(),/{}:;%]:+ {% function (d) { return `"${d[0].join('')}"`; } %}
            | ['"'] [^'"]:+ ['"'] {% function (d) { return { nodeName: 'quotedLiteral', values: [ d[1].join('')] } } %}

nodeName -> [a-zA-Z0-9\-()]:+ {% function (d) { return d[0].join('') } %}