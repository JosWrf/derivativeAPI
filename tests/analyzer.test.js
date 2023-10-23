import { Analyzer } from "../src/astAnalyzer.js";
import { Deriver } from "../src/deriver.js";
import { Lexer } from "../src/lexer.js";
import { Parser } from "../src/parser.js";

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

test("Analyzer: 17-23^2", () => {
  const ast = parseInput("17-23^2");
  const result = ast.accept(analyzer);
  expect(result).toEqual(new Set());
});

test("Deriver: x+y", () => {
  const ast = parseInput("x+y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("x+y");
  expect(result.derivatives["x"]).toBe("1+0");
  expect(result.derivatives["y"]).toBe("0+1");
});

test("Deriver: x*y", () => {
  const ast = parseInput("x*y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("x*y");
  expect(result.derivatives["x"]).toBe("x*0+1*y");
  expect(result.derivatives["y"]).toBe("x*1+0*y");
});

test("Deriver: x/y", () => {
  const ast = parseInput("x/y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("x/y");
  expect(result.derivatives["x"]).toBe("(1*y-x*0)/y^2");
  expect(result.derivatives["y"]).toBe("(0*y-x*1)/y^2");
});

test("Deriver: -(2+17)*x", () => {
  const ast = parseInput("-(2+17)*x");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("-(2+17)*x");
  expect(result.derivatives["x"]).toBe("-(2+17)*1+(0+0)*(-1)*x");
});

test("Deriver: exp(x+y)", () => {
  const ast = parseInput("exp(x+y)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("exp(x+y)");
  expect(result.derivatives["x"]).toBe("exp(x+y)*(1+0)");
  expect(result.derivatives["y"]).toBe("exp(x+y)*(0+1)");
});

test("Deriver: asin(-x)", () => {
  const ast = parseInput("asin(-x)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("asin(-x)");
  expect(result.derivatives["x"]).toBe("1/(1-(-x)^2)^0.5*(1*(-1))");
});
