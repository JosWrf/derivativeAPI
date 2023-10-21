import { Lexer } from "../src/lexer.js";
import { symbols } from "../src/parser.js";

const lexer = new Lexer();

test("Symbol Parser: atan", () => {
  const tokens = lexer.scanInput("atan");
  const result = symbols()(tokens);
  expect(result.value.lexeme).toBe("atan");
  expect(result.input.length).toBe(1);
});

test("Symbol Parser: x", () => {
  const tokens = lexer.scanInput("x");
  const result = symbols()(tokens);
  expect(result.value.lexeme).toBe("x");
  expect(result.input.length).toBe(1);
});

test("Symbol Parser: 17.53", () => {
  const tokens = lexer.scanInput("17.53");
  const result = symbols()(tokens);
  expect(result.value.lexeme).toBe("17.53");
  expect(result.input.length).toBe(1);
});
