const nearley = require('nearley');
const grammar = require('../../grammars/js/formalSyntax');

// TODO: make all of the nodeNames enum symbols
module.exports = class JsonGrammarFormatter2 {
  static format(formalSyntax) {
    const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(formalSyntax);
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
      },

      Plus: {
        toGrammarString([expression]) {
          return `( _ ${evaluate(expression)} _ ):+`;
        },
      },

      QuestionMark: {
        toGrammarString([expression]) {
          return `${evaluate(expression)}:?`;
        },
      },

      CurlyHash: {
        toGrammarString([expression, number]) {
          return `( ${Array(+number).fill(evaluate(expression)).join(' _ "," _ ')} )`;
        },
      },

      CurlyBraces: {
        toGrammarString([expression, min, comma, max]) {
          const minimumString = new Array(+min).fill().map(() => evaluate(expression)).join(' __ ');
          let maximumString = '';

          if (!comma) {
            return `( ${minimumString} )`;
          } else if (max) { // {integer,integer}
            maximumString = new Array(+max - +min).fill().map(() => `${evaluate(expression)}:?`).join(' __ ');
          } else { // {integer,}
            maximumString = `${evaluate(expression)}:*`;
          }

          return `( ${minimumString} __ ${maximumString} )`.trim();
        },
      },

      HashMark: {
        toGrammarString([expression]) {
          return `( ( ${evaluate(expression)} _ "," _):* ${evaluate(expression)} )`;
        },
      },


      SingleBar: {
        toGrammarString([left, right]) {
          return `( ${evaluate(left)} | ${evaluate(right)} )`;
        },
      },

      Brackets: {
        toGrammarString([expression]) {
          return `( ${evaluate(expression)} )`;
        },
      },

      DoubleAmpersand: {
        toGrammarString([left, right]) {
          if (right.nodeName === 'QuestionMark') {
            return `( ( ${evaluate(left)} ( __ ${evaluate(right)} ):? ) | ( ${evaluate(right)} __ ${evaluate(left)} ) )`;
          } else if (left.nodeName === 'QuestionMark') {
            return `( ( ${evaluate(left)} __ ${evaluate(right)} ) | ( ${evaluate(right)} ( __ ${evaluate(left)} ):? ) )`;
          }

          return `( ( ${evaluate(left)} __ ${evaluate(right)} ) | ( ${evaluate(right)} __ ${evaluate(left)} ) )`;
        },
      },

      DoubleBarList: {
        toGrammarString([list, end]) {
          const alternationNodes = list.map(([expression]) => evaluate(expression)).concat(evaluate(end)).join(' | ');
          const optionalValueString = `( __ ( ${alternationNodes} ) ):?`;

          return `( ${alternationNodes} ) ${Array(list.length).fill(optionalValueString).join(' ')}`;
        },
      },

      Juxtaposition: {
        toGrammarString([left, right]) {
          return `( ${evaluate(left)} __ ${evaluate(right)} )`;
        },
      },

      Comma: {
        toGrammarString([left, right]) {
          return `${evaluate(left)} ${evaluate(right)}`;
        },
      },

      node: {
        toGrammarString([nodeName]) {
          grammarsToResolve.add(nodeName);
          return `<${nodeName}>`;
        },

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
      ['Exp', rootNodeEvaluation],
      ...[...grammarsToResolve].map(grammarName => [grammarName]),
    ];
  }
};
