import { Lexer } from "../src/lexer.js";
import {
  symbols,
  parentheses,
  functions,
  unary,
  power,
  factor,
} from "../src/parser.js";
import {
  SymbolAST,
  ExprAST,
  FuncAST,
  UnaryAST,
  BinaryAST,
} from "../src/ast.js";

const lexer = new Lexer();

test("Symbol Parser: x", () => {
  const tokens = lexer.scanInput("x");
  const result = symbols()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(SymbolAST);
});

test("Symbol Parser: 17.53", () => {
  const tokens = lexer.scanInput("17.53");
  const result = symbols()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(SymbolAST);
});

test("Parentheses Parser: (x)", () => {
  const tokens = lexer.scanInput("(x)");
  const result = parentheses()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(ExprAST);
});

test("Function Parser: exp(x)", () => {
  const tokens = lexer.scanInput("exp(x)");
  const result = functions()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(FuncAST);
});

test("Unary Parser: -cos(y)", () => {
  const tokens = lexer.scanInput("-cos(y)");
  const result = unary()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(UnaryAST);
  expect(result.value.expr).toBeInstanceOf(FuncAST);
});

test("Power Parser: (y)^x", () => {
  const tokens = lexer.scanInput("(y)^x");
  const result = power()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(BinaryAST);
});

test("Power Parser: x^x^x", () => {
  const tokens = lexer.scanInput("x^x^x");
  const result = power()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(BinaryAST);
});

test("Factor parser: x*y/2", () => {
  const tokens = lexer.scanInput("x*y/2");
  const result = factor()(tokens);
  expect(result.input.length).toBe(1);
  expect(result.value).toBeInstanceOf(BinaryAST);
  expect(result.value.left).toBeInstanceOf(BinaryAST);
  expect(result.value.right).toBeInstanceOf(SymbolAST);
});
