import { TokenType } from "./token";

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
    const result = exprNode.expr.accept(this);
    return result;
  }

  visitFunc(funcNode) {
    //TODO: Handle all the different functions + chain rule
    return funcNode.expr.accept(this);
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
      default:
        break;
    }

    return { exprString, derivatives };
  }

  visitUnary(unaryNode) {
    //TODO: Add parentheses around all the derivates and expressions
    return unaryNode.expr.accept(this);
  }
}

export { Deriver };
