import {
  alternative,
  token,
  any,
  map,
  apply,
  lazy,
  conditionalRepeat,
} from "./combinators.js";
import { TokenType } from "./token.js";
import { ExprAST, SymbolAST, FuncAST, UnaryAST, BinaryAST } from "./ast.js";

class Parser {
  parse(tokens) {
    return linear()(tokens).value;
  }
}

function linear() {
  return map(
    apply(
      (left, right) => [left, ...right],
      [
        lazy(factor),
        conditionalRepeat(
          alternative(token(TokenType.PLUS), token(TokenType.MINUS)),
          lazy(factor)
        ),
      ]
    ),
    (values) => {
      let root = values[0];
      for (let index = 1; index < values.length - 1; index += 2) {
        root = new BinaryAST(root, values[index + 1], values[index].type);
      }
      return root;
    }
  );
}

function factor() {
  return map(
    apply(
      (left, right) => [left, ...right],
      [
        lazy(power),
        conditionalRepeat(
          alternative(token(TokenType.MULT), token(TokenType.DIV)),
          lazy(power)
        ),
      ]
    ),
    (values) => {
      let root = values[0];
      for (let index = 1; index < values.length - 1; index += 2) {
        root = new BinaryAST(root, values[index + 1], values[index].type);
      }
      return root;
    }
  );
}

function power() {
  return map(
    apply(
      (left, right) => [left, ...right],
      [
        lazy(unary),
        map(conditionalRepeat(token(TokenType.POW), lazy(unary)), (results) =>
          results.filter((_, index) => index % 2 !== 0)
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
    [token(TokenType.OPPAR), lazy(linear), token(TokenType.CPAR)]
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
      lazy(linear),
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

export {
  symbols,
  parentheses,
  functions,
  groupings,
  unary,
  power,
  factor,
  linear,
  Parser,
};
