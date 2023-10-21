import {
  alternative,
  token,
  any,
  map,
  apply,
  lazy,
  repeat,
  optional,
} from "./combinators.js";
import { TokenType } from "./token.js";
import { ExprAST, SymbolAST, FuncAST, UnaryAST, BinaryAST } from "./ast.js";

function power() {
  return map(
    apply(
      (left, right) => {
        return right === null ? [left] : [left, ...right];
      },
      [
        lazy(unary),
        optional(
          repeat(
            apply((_, value) => value, [token(TokenType.POW), lazy(unary)])
          )
        ),
      ]
    ),
    (values) => {
      let root = values[0];
      for (let index = 1; index < values.length; index++) {
        root = new BinaryAST(root, values[index], TokenType.POW);
      }
      return root;
    }
  );
}

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
    [token(TokenType.OPPAR), lazy(power), token(TokenType.CPAR)]
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
      lazy(power),
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

export { symbols, parentheses, functions, groupings, unary, power };
