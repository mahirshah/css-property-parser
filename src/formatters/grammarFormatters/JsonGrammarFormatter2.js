// todo: don't use nearely make use the js grammar directly
const fs = require('fs-extra');
const make = require('nearley-make');
const grammar = fs.readFileSync('./grammars/formalSyntax2.ne', 'utf-8');

const SINGLE_EXPRESSION_PARSING_FUNCTION = nodeName => `{% function (d) { return { nodeName: ${nodeName}, values: [d[0]] } %}`;
const DOUBLE_EXPRESSION_PARSING_FUNCTION = nodeName => `{% function (d) { return { nodeName: ${nodeName}, values: d[0].filter(Boolean) } %}`;
const TERMINAL_EXPRESSION_PARSING_FUNCTION = () => "{% function (d) { return d[0].join(''); %}";

module.exports = class JsonGrammarFormatter2 {
  static format(formalSyntax) {
    const parser = make(grammar, {}).feed(formalSyntax);
    const [rootNode] = parser.results;
    return JsonGrammarFormatter2._evaluateNode(rootNode);
  }

  static _evaluateNode(node) {
    const grammarsToResolve = new Set();
    const tokenToEvaluationMap = {
      Asterisk: {
        toGrammarString([expression]) {
          return `( _ ${evaluate(expression)} _ ):*`;
        },
        parsingExpression: SINGLE_EXPRESSION_PARSING_FUNCTION,
      },

      Plus: {
        toGrammarString([expression]) {
          return `( _ ${evaluate(expression)} _ ):+`;
        },
        parsingExpression: SINGLE_EXPRESSION_PARSING_FUNCTION,
      },

      QuestionMark: {
        toGrammarString([expression]) {
          return `${evaluate(expression)}:?`;
        },
        parsingExpression: SINGLE_EXPRESSION_PARSING_FUNCTION,
      },

      CurlyHash: {
        toGrammarString([expression, number]) {
          return Array(+number).fill(evaluate(expression)).join('_ "," _');
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },

      CurlyBraces: {
        toGrammarString([expression, min, comma, max]) {
          const minimumString = new Array(+min).fill().map(() => evaluate(expression)).join(' __ ');
          let maximumString = '';

          if (comma) {
            if (max) { // {integer,integer}
              maximumString = new Array(+max - +min).fill().map(() => `${evaluate(expression)}:?`).join(' __ ');
            } else { // {integer,}
              maximumString = `${evaluate(expression)}:*`;
            }
          }

          return `${minimumString} __ ${maximumString}`.trim();
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },

      HashMark: {
        toGrammarString([expression]) {
          return `( ( ${evaluate(expression)} _ "," _):* ${evaluate(expression)} )`;
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },


      SingleBar: {
        toGrammarString([left, right]) {
          return `( ${evaluate(left)} | ${evaluate(right)} )`;
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },

      Brackets: {
        toGrammarString([expression]) {
          return `( ${evaluate(expression)} )`;
        },
        parsingExpression: SINGLE_EXPRESSION_PARSING_FUNCTION,
      },

      DoubleAmpersand: {
        toGrammarString([left, right]) {
          return `( ( ${evaluate(left)} __ ${evaluate(right)} ) | ( ${evaluate(right)} __ ${evaluate(left)} ) )`;
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },

      DoubleBar: {
        toGrammarString([left, right]) {
          return `( ( ${evaluate(left)} __ ${evaluate(right)}:? ) | ( ${evaluate(right)} __ ${evaluate(left)}:? ) )`;
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },

      Juxtaposition: {
        toGrammarString([left, right]) {
          return `( ${evaluate(left)} __ ${evaluate(right)} )`;
        },
        parsingExpression: DOUBLE_EXPRESSION_PARSING_FUNCTION,
      },

      node: {
        toGrammarString([nodeName]) {
          grammarsToResolve.add(nodeName);
          return nodeName;
        },
        parsingExpression: TERMINAL_EXPRESSION_PARSING_FUNCTION,
      },
    };
    const rootNodeEvaluation = evaluate(node);

    function evaluate(root) {
      if (typeof root !== 'object') {
        return root;
      } else if (!tokenToEvaluationMap[root.nodeName]) {
        return root;
      }

      return tokenToEvaluationMap[root.nodeName].toGrammarString(root.values);
    }

    return [
      ['Exp', rootNodeEvaluation, tokenToEvaluationMap[node.nodeName].parsingExpression],
      ...[...grammarsToResolve].map(grammarName => [grammarName]),
    ];
  }
};
