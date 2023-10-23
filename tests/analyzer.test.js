import { Analyzer } from "../src/astAnalyzer.js";
import { Deriver } from "../src/deriver.js";
import { Lexer } from "../src/lexer.js";
import { Parser } from "../src/parser.js";

//TODO: Make the test conditions stricter
const lexer = new Lexer();
const parser = new Parser();
const analyzer = new Analyzer();
const deriver = new Deriver();

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

test("Deriver: x+y", () => {
  const ast = parseInput("x+y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(typeof result.derivatives["x"]).toBe("string");
  expect(typeof result.derivatives["y"]).toBe("string");
});

test("Deriver: x*y", () => {
  const ast = parseInput("x*y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(typeof result.derivatives["x"]).toBe("string");
  expect(typeof result.derivatives["y"]).toBe("string");
});

test("Deriver: x/y", () => {
  const ast = parseInput("x/y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(typeof result.derivatives["x"]).toBe("string");
  expect(typeof result.derivatives["y"]).toBe("string");
});

test("Deriver: -(2+17)*x", () => {
  const ast = parseInput("-(2+17)*x");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(typeof result.derivatives["x"]).toBe("string");
});

test.only("Deriver: exp(x+y)", () => {
  const ast = parseInput("exp(x+y)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  console.log(result);
  expect(typeof result.derivatives["x"]).toBe("string");
  expect(typeof result.derivatives["y"]).toBe("string");
});
