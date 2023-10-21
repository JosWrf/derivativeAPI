class AST {}

class SymbolAST extends AST {
  constructor(value) {
    super();
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitSymbol(this);
  }
}

class ExprAST extends AST {
  constructor(expr) {
    super();
    this.expr = expr;
  }

  accept(visitor) {
    return visitor.visitExpr(this);
  }
}

class FuncAST extends AST {
  constructor(expr, func) {
    super();
    this.expr = expr;
    this.func = func;
  }

  accept(visitor) {
    return visitor.visitFunc(this);
  }
}

class UnaryAST extends AST {
  constructor(expr) {
    super();
    this.expr = expr;
  }

  accept(visitor) {
    return visitor.visitUnary(this);
  }
}

class BinaryAST extends AST {
  constructor(left, right, operator) {
    super();
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  accept(visitor) {
    return visitor.visitBinary(this);
  }
}

export { SymbolAST, ExprAST, FuncAST, UnaryAST, BinaryAST };
