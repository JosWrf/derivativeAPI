import { TokenType } from "./token";

function chainRule(variables, innerFunction, derivatives, derivative) {
  return variables.reduce((result, key) => {
    result[key] = derivative.replace("_", innerFunction)  +
      "*" + "(" + derivatives[key] + ")";
    return result;
  }, {});
}


class Deriver {
  #variables = [];

  set variables(variables) {
    this.#variables = Array.from(variables);
  }

  visitSymbol(symbolNode) {
    const derivatives = this.#variables.reduce((dictionary, name) => {
      dictionary[name] = "0";
      return dictionary;
    }, {});

    const nodeType = symbolNode.value.type;
    const exprString = symbolNode.value.lexeme;
    if (nodeType === TokenType.VAR) {
      derivatives[exprString] = "1";
    }
    return { exprString, derivatives };
  }

  visitExpr(exprNode) {
    const exprStr = exprNode.expr.accept(this);
    const exprString = "(" + exprStr.exprString + ")";
    const derivatives = this.#variables.reduce((result, key) => {
      result[key] = "(" + exprStr.derivatives[key] + ")";
      return result;
    }, {});
    return { exprString, derivatives };
  }

  visitFunc(funcNode) {
    //TODO: Handle all the different functions + chain rule
    const exprStr = funcNode.expr.accept(this);
    const funcName = funcNode.func.type;
    const exprString = funcNode.func.lexeme + "(" + exprStr.exprString + ")";

    let derivatives;

    switch (funcName) {
      case TokenType.COS:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "-sin(_)");
        break;
      case TokenType.ACOS:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "-1/(1+(_)^2)^0.5");
        break;
      case TokenType.SIN:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "cos(_)");
        break;
      case TokenType.ASIN:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "1/(1-(_)^2)^0.5");
        break;
      case TokenType.TAN:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "1/cos(_)^2");
        break;
      case TokenType.ATAN:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "1/(1+(_)^2)");
        break;
      case TokenType.EXP:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "exp(_)");
        break;
      case TokenType.LN:
        derivatives = chainRule(this.#variables, exprStr.exprString, exprStr.derivatives, "1/(_)");
        break;
      default:
        break;
    }

    return { exprString, derivatives };
  }

  visitBinary(binaryNode) {
    //TODO: Handle all the different operators
    const leftExpr = binaryNode.left.accept(this);
    const rightExpr = binaryNode.right.accept(this);
    const operator = binaryNode.operator;

    const exprString = leftExpr.exprString + operator + rightExpr.exprString;
    let derivatives;

    switch (operator) {
      case TokenType.PLUS:
      case TokenType.MINUS:
        derivatives = this.#variables.reduce((result, key) => {
          result[key] =
            leftExpr.derivatives[key] + operator + rightExpr.derivatives[key];
          return result;
        }, {});
        break;
      case TokenType.MULT:
        derivatives = this.#variables.reduce((result, key) => {
          result[key] =
            leftExpr.exprString + operator + rightExpr.derivatives[key] + "+" +
            leftExpr.derivatives[key] + operator + rightExpr.exprString;
          return result;
        }, {});
        break;
      case TokenType.DIV:
        derivatives = this.#variables.reduce((result, key) => {
          result[key] =
            "(" + leftExpr.derivatives[key] + "*" + rightExpr.exprString + "-" +
            leftExpr.exprString + "*" + rightExpr.derivatives[key] + ")" + "/" +
            rightExpr.exprString + "^2";
          return result;
        }, {});
        break;
      default:
        break;
    }

    return { exprString, derivatives };
  }

  visitUnary(unaryNode) {
    const exprStr = unaryNode.expr.accept(this);
    const exprString = "-" + exprStr.exprString;
    const derivatives = this.#variables.reduce((result, key) => {
      result[key] = exprStr.derivatives[key] + "*(-1)";
      return result;
    }, {});
    return { exprString, derivatives };
  }
}

export { Deriver };
