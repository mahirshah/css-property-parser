const GRAMMAR_CONSTANTS = require('../constants/grammars');
const CaseConverterUtils = require('../utils/CaseConverterUtils');

const INTERMEDIATE_GRAMMAR_PREFIX = 'IntermediateRule';
const TERMINAL_GRAMMARS = ['dataName', 'literal', 'node'];

/**
 * Class to convert a CSS formal syntax into a JSON grammar.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/Value_definition_syntax for more info on CSS value definition
 * syntax.
 * @type {JsonGrammarFormatter}
 */
module.exports = class JsonGrammarFormatter {

  /**
   * Creates a JsonGrammarFormatter which can be used to convert a CSS formal syntax string into a JSON grammar.
   *
   * @param {Object} formalSyntaxGrammar - an ohm grammar to parse a CSS formal syntax
   */
  constructor(formalSyntaxGrammar) {
    this.formalSyntaxGrammar = formalSyntaxGrammar;
    this.formalSyntaxSemantics = this._generateSemantics();
  }

  /**
   * Attempts to format a formal syntax string into a JSON grammar. Returns a JSON grammar if the formal syntax
   * matches the given formal syntax grammar. If the match fails, an error in thrown.
   *
   * @param {string} propertyName - the property this formal syntax is associated with. Should be in kebab-case format.
   *                                For example, "bg-color" or "color()".
   * @param {string} formalSyntax - the css formal syntax string. For example, "white | blue | red || green"
   * @returns {Object} - a JSON grammar if the formal syntax matches the formal syntax grammar, else throws
   * a                   an error indicating why the match failed.
   */
  formatFormalSyntax(propertyName, formalSyntax) {
    this.intermediateGrammarIndex = 0;
    this.intermediateGrammars = [];
    this.grammarsToResolve = new Set();
    this.propertyName = propertyName;
    const match = this.formalSyntaxGrammar.match(formalSyntax);

    if (match.succeeded()) {
      const baseOhmGrammar = this.formalSyntaxSemantics(match).eval();
      const grammarsToResolve = Array.from(this.grammarsToResolve).map(grammarName => [grammarName]);
      return [
        [GRAMMAR_CONSTANTS.LEXICAL_BASE_KEY, baseOhmGrammar],
        ...this.intermediateGrammars,
        ...grammarsToResolve,
      ];
    }

    throw new Error(`Formal syntax: ${formalSyntax}, failed to match: ${match.message}`);
  }

  /* eslint-disable no-unused-vars */
  /**
   * Generates the Ohm Semantics object corresponding to the formal syntax grammar found in
   * "../grammars/formalSyntax.ohm".
   *
   * @returns {Object} - the Ohm Semantics object based on the formal syntax grammar
   * @private
   */
  _generateSemantics() {
    const grammarFormatter = this;

    return this.formalSyntaxGrammar.createSemantics().addOperation('eval', {
      // simply the root formal syntax
      Exp(baseExpression) {
        return baseExpression.eval();
      },

      // syntax of the form: "[ <expression> ]"
      Brackets(leftBracket, e, rightBracket) {
        return `( ${e.eval()} )`;
      },

      // syntax of the form: "<expression> <expression>"
      Juxtaposition(expression1, expression2) {
        return `${expression1.eval()} ${expression2.eval()}`;
      },

      // syntax of the form: "<expression> && <expression>"
      DoubleAmpersand(expression1, doubleAmp, expression2) {
        const expression1Eval = expression1.eval();
        const expression2Eval = expression2.eval();

        return `( ${expression1Eval} ${expression2Eval} ) | ( ${expression2Eval} ${expression1} )`;
      },

      // syntax of the form: "<expression> || <expression>"
      DoubleBar(expression1, doubleBar, expression2) {
        const expressionEvaluations = [expression1, expression2]
          .map(expression => [expression, grammarFormatter._getNodeName(expression)])
          .map(([expression, nodeName]) => [expression, TERMINAL_GRAMMARS.includes(nodeName)])
          .map(([expression, isTerminal]) => {
            if (!isTerminal) {
              const intermediateGrammarRuleName = grammarFormatter._generateIntermediateGrammarRuleName();
              grammarFormatter.intermediateGrammars.push([intermediateGrammarRuleName, expression.eval()]);
              return intermediateGrammarRuleName;
            }

            return expression.eval();
          })
          .join(' , ');

        return `${GRAMMAR_CONSTANTS.DOUBLE_BAR_PARAMETERIZED_RULE_NAME}< ${expressionEvaluations} >`;
      },

      // syntax of the form: "<expression> | <expression>"
      SingleBar(expression1, singleBar, expression2) {
        return `${expression1.eval()} | ${expression2.eval()}`;
      },

      // syntax of the form: "<expression>*"
      Asterisk(expression, asterisk) {
        return `${expression.eval()}*`;
      },

      // syntax of the form: "<expression>+"
      Plus(expression, plus) {
        return `${expression.eval()}+`;
      },

      // syntax of the form: "<expression>?"
      QuestionMark(expression, questionMark) {
        return `${expression.eval()}?`;
      },

      // syntax of the form: "<expression>{<integer>, <integer>}"
      CurlyBraces(expression, b1, lowerLimit, comma, upperLimit, b2) {
        const min = +lowerLimit.sourceString;
        const max = +upperLimit.sourceString;
        const minimumString = new Array(min).fill().map(() => expression.eval()).join(' ');
        const maximumString = new Array(max - min).fill().map(() => `${expression.eval()}?`).join(' ');

        return `${minimumString} ${maximumString}`;
      },

      // syntax of the form: "<expression>#"
      HashMark(expression, hashmark) {
        return `listOf< ${expression.eval()} , "," >`;
      },

      // syntax of the form: "<data-name>" or "<'data-name'>
      node(leftBracket, leftQuote, dataName, rightQuote, rightBracket) {
        const dataNameValue = dataName.eval();

        grammarFormatter.grammarsToResolve.add(`<${dataNameValue}>`);
        return `<${dataNameValue}>`;
      },

      nodeName(expression) {
        return this.sourceString;
      },

      // any string
      dataName(e) {
        return `"${this.sourceString}"`;
      },

      // a character literal like "," or "/"
      literal(e) {
        return `"${this.sourceString}"`;
      },
    });
  }

  /**
   * Returns the node name of the given node
   * @param {Object} node - an Ohm AST node
   * @returns {string} - the node name of the given node
   * @private
   */
  _getNodeName(node) {
    return node.numChildren && node.children[0].ctorName;
  }

  /**
   * Generates the next intermediate grammar rule name. This is used in when parsing double bar expressions
   * that don't contain terminal expressions. For example, given the formal syntax "(a | b) || c", we would have
   * to create a intermediate rule for the left hand side of the double bar expression. Thus we would want something
   * like:
   * exp = UnorderedOptionalTuple< IntermediateRule1, c >
   * IntermediateRule1 = (a | b)
   *
   * @returns {string}
   * @private
   */
  _generateIntermediateGrammarRuleName() {
    return `${CaseConverterUtils.formalSyntaxIdentToOhmIdent(`<${this.propertyName}>`)}${INTERMEDIATE_GRAMMAR_PREFIX}${this.intermediateGrammarIndex++}`;
  }
};
