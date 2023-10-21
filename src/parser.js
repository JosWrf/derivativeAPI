import { alternative, token, any, map, apply, lazy } from "./combinators.js";
import { TokenType } from "./token.js";
import { ExprAST, SymbolAST, FuncAST, UnaryAST } from "./ast.js";

function unary() {
  return alternative(
    groupings(),
    apply(
      (minus, expr) => new UnaryAST(expr),
      [token(TokenType.MINUS), lazy(unary)]
    )
  );
}

function groupings() {
  return any([parentheses(), symbols(), functions()]);
}

function parentheses() {
  return apply(
    (oppar, expr, cpar) => new ExprAST(expr),
    [token(TokenType.OPPAR), lazy(unary), token(TokenType.CPAR)]
  );
}

function functions() {
  return apply(
    (fname, oppar, expr, cpar) => new FuncAST(expr, fname),
    [
      any([
        token(TokenType.COS),
        token(TokenType.ACOS),
        token(TokenType.SIN),
        token(TokenType.ASIN),
        token(TokenType.TAN),
        token(TokenType.ATAN),
        token(TokenType.EXP),
        token(TokenType.LN),
      ]),
      token(TokenType.OPPAR),
      lazy(unary),
      token(TokenType.CPAR),
    ]
  );
}

function symbols() {
  return map(
    alternative(token(TokenType.VAR), token(TokenType.NUM)),
    (value) => new SymbolAST(value)
  );
}

export { symbols, parentheses, functions, groupings, unary };
