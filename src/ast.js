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

export { SymbolAST, ExprAST, FuncAST, UnaryAST };
