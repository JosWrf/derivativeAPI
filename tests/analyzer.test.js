import { Analyzer } from "../src/astAnalyzer.js";
import { Lexer } from "../src/lexer.js";
import { Parser } from "../src/parser.js";

const lexer = new Lexer();
const parser = new Parser();
const analyzer = new Analyzer();

parseInput = (input) => {
  const tokens = lexer.scanInput(input);
  const ast = parser.parse(tokens);
  return ast;
};

test("Analyzer: x^(y/z)-k+x", () => {
  const ast = parseInput("x^(y/z)-k+x");
  const result = ast.accept(analyzer);
  expect(result).toEqual(new Set(["x", "y", "z", "k"]));
});
