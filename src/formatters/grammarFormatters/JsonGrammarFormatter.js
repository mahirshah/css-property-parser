const nearley = require('nearley');
const GRAMMAR_CONSTANTS = require('../../constants/grammars');
const grammar = require('../../grammars/js/formalSyntax');

module.exports = class JsonGrammarFormatter {
  static format(formalSyntax) {
    const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart).feed(formalSyntax);
    const [rootNode] = parser.results;
    return JsonGrammarFormatter._evaluateNode(rootNode);
  }

  static _evaluateNode(node) {
    const grammarsToResolve = new Set();
    const tokenToEvaluationMap = {
      Asterisk([expression]) {
        return `( _ ${evaluate(expression)} _ ):*`;
      },

      Plus([expression]) {
        return `( _ ${evaluate(expression)} _ ):+`;
      },

      QuestionMark([expression]) {
        return `${evaluate(expression)}:?`;
      },

      CurlyHash([expression, number, comma]) {
        if (comma) {
          return `( ${Array(+number).fill(evaluate(expression)).join(' _ "," _ ')} ( _ "," _ ${evaluate(expression)} ):* )`;
        }

        return `( ${Array(+number).fill(evaluate(expression)).join(' _ "," _ ')} )`;
      },

      CurlyBraces([expression, min, comma, max]) {
        const minimumString = new Array(+min).fill().map(() => evaluate(expression)).join(' __ ');
        let maximumString = '';

        if (!comma) {
          return `( ${minimumString} )`;
        } else if (max) { // {integer,integer}
          maximumString = new Array(+max - +min).fill().map(() => `( __ ${evaluate(expression)} ):?`).join(' ');
        } else { // {integer,}
          maximumString = `${evaluate(expression)}:*`;
        }

        return `( ${minimumString} ${maximumString} )`.trim();
      },

      HashMark([expression]) {
        return `( ( ${evaluate(expression)} _ "," _):* ${evaluate(expression)} )`;
      },

      SingleBarList([list, end]) {
        const alternationNodes = list.map(([expression]) => evaluate(expression)).concat(evaluate(end)).join(' | ');

        return `( ${alternationNodes} )`;
      },

      Brackets([expression]) {
        return `( ${evaluate(expression)} )`;
      },

      DoubleAmpersand([left, right]) {
        if (right.nodeName === 'QuestionMark') {
          return `( ( ${evaluate(left)} ( __ ${evaluate(right)} ):? ) | ( ${evaluate(right)} __ ${evaluate(left)} ) )`;
        } else if (left.nodeName === 'QuestionMark') {
          return `( ( ${evaluate(left)} __ ${evaluate(right)} ) | ( ${evaluate(right)} ( __ ${evaluate(left)} ):? ) )`;
        }

        return `( ( ${evaluate(left)} __ ${evaluate(right)} ) | ( ${evaluate(right)} __ ${evaluate(left)} ) )`;
      },

      DoubleBarList([list, end]) {
        const alternationNodes = list.map(([expression]) => evaluate(expression)).concat(evaluate(end)).join(' | ');

        return `( ${alternationNodes} ) ( __ ( ${alternationNodes} ) ):*`;
      },

      Juxtaposition([left, right]) {
        return `( ${evaluate(left)} __ ${evaluate(right)} )`;
      },

      Comma([left, right]) {
        return `${evaluate(left)} ${evaluate(right)}`;
      },

      node([nodeName]) {
        grammarsToResolve.add(`<${nodeName}>`);
        return `<${nodeName}>`;
      },
    };
    const rootNodeEvaluation = evaluate(node);

    function evaluate(root) {
      if (typeof root !== 'object') {
        return root;
      } else if (!tokenToEvaluationMap[root.nodeName]) {
        return root;
      }

      return tokenToEvaluationMap[root.nodeName](root.values);
    }

    return [
      [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, rootNodeEvaluation],
      ...[...grammarsToResolve].map(grammarName => [grammarName]),
    ];
  }
};
