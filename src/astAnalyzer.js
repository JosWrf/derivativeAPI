import { TokenType } from "./token.js";

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

class Analyzer {
  visitSymbol(symbolNode) {
    const variables = new Set();
    const nodeType = symbolNode.value.type;
    const lexeme = symbolNode.value.lexeme;
    if (nodeType === TokenType.VAR) {
      variables.add(lexeme);
    }
    return variables;
  }

  visitExpr(exprNode) {
    const result = exprNode.expr.accept(this);
    return result;
  }

  visitFunc(funcNode) {
    return funcNode.expr.accept(this);
  }

  visitBinary(binaryNode) {
    const vars = binaryNode.left.accept(this);
    const othervars = binaryNode.right.accept(this);
    return union(vars, othervars);
  }

  visitUnary(unaryNode) {
    return unaryNode.expr.accept(this);
  }
}

export { Analyzer };
