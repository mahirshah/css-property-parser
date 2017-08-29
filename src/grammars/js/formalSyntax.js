// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "Exp", "symbols": ["SingleBarList"], "postprocess": id},
    {"name": "Combinator", "symbols": ["Brackets", {"literal":"*"}], "postprocess": function (d) { return { nodeName: 'Asterisk', values: [d[0]] }; }},
    {"name": "Combinator", "symbols": ["Brackets", {"literal":"+"}], "postprocess": function (d) { return { nodeName: 'Plus', values: [d[0]] }; }},
    {"name": "Combinator", "symbols": ["Brackets", {"literal":"?"}], "postprocess": function (d) { return { nodeName: 'QuestionMark', values: [d[0]] }; }},
    {"name": "Combinator$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "Combinator$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Combinator$ebnf$2", "symbols": ["unsigned_int"], "postprocess": id},
    {"name": "Combinator$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Combinator", "symbols": ["Brackets", {"literal":"{"}, "unsigned_int", "_", "Combinator$ebnf$1", "_", "Combinator$ebnf$2", {"literal":"}"}], "postprocess":  function (d, l, r) {
            if(d[0] && d[0].nodeName === 'HashMark') return r;
        
            return { nodeName: 'CurlyBraces', values: [d[0], d[2], d[4], d[6]] };
        } },
    {"name": "Combinator$string$1", "symbols": [{"literal":"#"}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Combinator$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "Combinator$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Combinator", "symbols": ["Brackets", "Combinator$string$1", "unsigned_int", "_", "Combinator$ebnf$3", {"literal":"}"}], "postprocess": function (d) { return { nodeName: 'CurlyHash', values: [d[0], d[2], d[4]] }; }},
    {"name": "Combinator", "symbols": ["Brackets", {"literal":"#"}], "postprocess": function (d) { return { nodeName: 'HashMark', values: [d[0]] }; }},
    {"name": "Combinator", "symbols": ["terminal"], "postprocess": id},
    {"name": "SingleBarList$ebnf$1$subexpression$1", "symbols": ["DoubleBarList", "__", {"literal":"|"}, "__"]},
    {"name": "SingleBarList$ebnf$1", "symbols": ["SingleBarList$ebnf$1$subexpression$1"]},
    {"name": "SingleBarList$ebnf$1$subexpression$2", "symbols": ["DoubleBarList", "__", {"literal":"|"}, "__"]},
    {"name": "SingleBarList$ebnf$1", "symbols": ["SingleBarList$ebnf$1", "SingleBarList$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SingleBarList", "symbols": ["SingleBarList$ebnf$1", "DoubleBarList"], "postprocess":  function (d) {
          return {
            nodeName: 'SingleBarList',
            values: [d[0], d[1]],
          };
        } },
    {"name": "SingleBarList", "symbols": ["DoubleBarList"], "postprocess": id},
    {"name": "DoubleBarList$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DoubleBarList$ebnf$1$subexpression$1", "symbols": ["DoubleAmpersand", "__", "DoubleBarList$ebnf$1$subexpression$1$string$1", "__"]},
    {"name": "DoubleBarList$ebnf$1", "symbols": ["DoubleBarList$ebnf$1$subexpression$1"]},
    {"name": "DoubleBarList$ebnf$1$subexpression$2$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DoubleBarList$ebnf$1$subexpression$2", "symbols": ["DoubleAmpersand", "__", "DoubleBarList$ebnf$1$subexpression$2$string$1", "__"]},
    {"name": "DoubleBarList$ebnf$1", "symbols": ["DoubleBarList$ebnf$1", "DoubleBarList$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DoubleBarList", "symbols": ["DoubleBarList$ebnf$1", "DoubleAmpersand"], "postprocess": function (d) { return { nodeName: 'DoubleBarList', values: [d[0], d[1]] }; }},
    {"name": "DoubleBarList", "symbols": ["DoubleAmpersand"], "postprocess": id},
    {"name": "DoubleAmpersand$subexpression$1$string$1", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DoubleAmpersand$subexpression$1", "symbols": ["DoubleAmpersand", "__", "DoubleAmpersand$subexpression$1$string$1", "__", "Juxtaposition"]},
    {"name": "DoubleAmpersand", "symbols": ["DoubleAmpersand$subexpression$1"], "postprocess":  function (d) {
          return {
            nodeName: 'DoubleAmpersand',
            values: [d[0][0], d[0][4]],
          };
        } },
    {"name": "DoubleAmpersand", "symbols": ["Juxtaposition"], "postprocess": id},
    {"name": "Juxtaposition$subexpression$1", "symbols": ["Juxtaposition", "__", "Comma"]},
    {"name": "Juxtaposition", "symbols": ["Juxtaposition$subexpression$1"], "postprocess":  function (d) {
          return {
            nodeName: 'Juxtaposition',
            values: [d[0][0], d[0][2]],
          };
        } },
    {"name": "Juxtaposition", "symbols": ["Comma"], "postprocess": id},
    {"name": "Comma$subexpression$1", "symbols": ["Comma", "_", {"literal":","}, "_", "terminal"]},
    {"name": "Comma", "symbols": ["Comma$subexpression$1"], "postprocess":  function (d) {
          return {
            nodeName: 'Comma',
            values: [d[0][0], d[0][4]],
          };
        } },
    {"name": "Comma", "symbols": ["Brackets"], "postprocess": id},
    {"name": "Brackets", "symbols": [{"literal":"["}, "_", "SingleBarList", "_", {"literal":"]"}], "postprocess":  function (d) {
          return {
            nodeName: 'Brackets',
            values: [d[2]],
          };
        } },
    {"name": "Brackets", "symbols": ["Combinator"], "postprocess": id},
    {"name": "terminal$ebnf$1", "symbols": [{"literal":"'"}], "postprocess": id},
    {"name": "terminal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "terminal$ebnf$2", "symbols": [{"literal":"'"}], "postprocess": id},
    {"name": "terminal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "terminal", "symbols": [{"literal":"<"}, "terminal$ebnf$1", "nodeName", "terminal$ebnf$2", {"literal":">"}], "postprocess":  function (d) {
          return {
            nodeName: 'node',
            values: [d.length === 5 ? d[2] : d[1]],
          };
        } },
    {"name": "terminal$ebnf$3", "symbols": [/[a-zA-Z0-9@\-(),\/{}:;%]/]},
    {"name": "terminal$ebnf$3", "symbols": ["terminal$ebnf$3", /[a-zA-Z0-9@\-(),\/{}:;%]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "terminal", "symbols": ["terminal$ebnf$3"], "postprocess": function (d) { return `"${d[0].join('')}"`; }},
    {"name": "terminal$ebnf$4", "symbols": [/[^'"]/]},
    {"name": "terminal$ebnf$4", "symbols": ["terminal$ebnf$4", /[^'"]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "terminal", "symbols": [/['"']/, "terminal$ebnf$4", /['"']/], "postprocess": function (d) { return { nodeName: 'quotedLiteral', values: [ d[1].join('')] } }},
    {"name": "nodeName$ebnf$1", "symbols": [/[a-zA-Z0-9\-()]/]},
    {"name": "nodeName$ebnf$1", "symbols": ["nodeName$ebnf$1", /[a-zA-Z0-9\-()]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nodeName", "symbols": ["nodeName$ebnf$1"], "postprocess": function (d) { return d[0].join('') }}
]
  , ParserStart: "Exp"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
