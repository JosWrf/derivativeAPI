import { Lexer } from "../src/lexer";
import { TokenType } from "../src/token.js";

const lexer = new Lexer();

test("-17", () => {
  const result = lexer.scanInput("-17");
  const expectedTypes = [TokenType.MINUS, TokenType.NUM, TokenType.EOF];
  expect(result.map((val) => val.type)).toEqual(expectedTypes);
});

test("Adds 10+20", () => {
  const result = lexer.scanInput("10+20");
  const expectedTypes = [
    TokenType.NUM,
    TokenType.PLUS,
    TokenType.NUM,
    TokenType.EOF,
  ];
  expect(result.map((val) => val.type)).toEqual(expectedTypes);
});

test("Adds 17^(2/1)", () => {
  const result = lexer.scanInput("17^(2/1)");
  const expectedTypes = [
    TokenType.NUM,
    TokenType.POW,
    TokenType.OPPAR,
    TokenType.NUM,
    TokenType.DIV,
    TokenType.NUM,
    TokenType.CPAR,
    TokenType.EOF,
  ];
  expect(result.map((val) => val.type)).toEqual(expectedTypes);
});

test("Invalid FP", () => {
  expect(() => lexer.scanInput("129.+")).toThrow();
  expect(() => lexer.scanInput("9.")).toThrow();
});

test("cos(exp(x))", () => {
  const result = lexer.scanInput("cos(exp(x))");
  const expectedTypes = [
    TokenType.COS,
    TokenType.OPPAR,
    TokenType.EXP,
    TokenType.OPPAR,
    TokenType.VAR,
    TokenType.CPAR,
    TokenType.CPAR,
    TokenType.EOF,
  ];
  expect(result.map((val) => val.type)).toEqual(expectedTypes);
});

test("lnl", () => {
  const result = lexer.scanInput("lnl");
  const expectedTypes = [TokenType.LN, TokenType.VAR, TokenType.EOF];
  expect(result.map((val) => val.type)).toEqual(expectedTypes);
});
