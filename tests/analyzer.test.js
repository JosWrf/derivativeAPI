import { Analyzer } from "../src/astAnalyzer.js";
import { Deriver } from "../src/deriver.js";
import { Lexer } from "../src/lexer.js";
import { ExprOptimizer } from "../src/optimizer.js";
import { Parser } from "../src/parser.js";

const lexer = new Lexer();
const parser = new Parser();
const analyzer = new Analyzer();
const deriver = new Deriver();
const optimizer = new ExprOptimizer();

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
  expect(result.derivatives["x"]).toBe("(x)*(0)+(1)*(y)");
  expect(result.derivatives["y"]).toBe("(x)*(1)+(0)*(y)");
});

test("Deriver: x/y", () => {
  const ast = parseInput("x/y");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("x/y");
  expect(result.derivatives["x"]).toBe("((1)*(y)-((x)*(0)))/(y)^2");
  expect(result.derivatives["y"]).toBe("((0)*(y)-((x)*(1)))/(y)^2");
});

test("Deriver: -(2+17)*x", () => {
  const ast = parseInput("-(2+17)*x");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.exprString).toBe("-(2+17)*x");
  expect(result.derivatives["x"]).toBe("(-(2+17))*(1)+(((0+0))*(-1))*(x)");
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
  expect(result.derivatives["x"]).toBe("1/(1-(-x)^2)^0.5*((1)*(-1))");
});

test("Deriver: x^x", () => {
  const ast = parseInput("x^x");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(deriver);
  expect(result.derivatives["x"]).toBe("x^x*(1*ln(x)+x*1/x*1)");
});

test("Optimizer: (1+0)*(1-4)", () => {
  const ast = parseInput("(1+0)*(1-4)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(optimizer).exprString;
  expect(result).toBe("(-3)");
});

test("Optimizer: (2)*(y)", () => {
  const ast = parseInput("(2)*(y)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(optimizer).exprString;
  expect(result).toBe("2*y");
});

test("Optimizer: -(2+17)*1+(0+0)*(-1)*x", () => {
  const ast = parseInput("-(2+17)*1+(0+0)*(-1)*x");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(optimizer).exprString;
  expect(result).toBe("(-19)");
});

test("Optimizer: x^x*(1*ln(x)+x*1/x*1)", () => {
  const ast = parseInput("x^x*(1*ln(x)+x*1/x*1)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(optimizer).exprString;
  expect(result).toBe("x^x*(ln(x)+1)");
});

test("Optimizer: cos(x)^0*sin(0)+(0/17)", () => {
  const ast = parseInput("cos(x)^0*sin(0)+(0/17)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const result = ast.accept(optimizer).exprString;
  expect(result).toBe("sin(0)");
});

test("Deriver + Optimizer: 1/5*(x^2+2*x*y)", () => {
  const ast = parseInput("1/5*(x^2+2*x*y)");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const derivation = ast.accept(deriver);

  const derivationAST = parseInput(derivation.derivatives["x"]);
  const result = derivationAST.accept(optimizer);
  expect(result.exprString).toBe("0.2*((x^2*(2/x)+2*y))");
});

test("Deriver + Optimizer: x^n*y^m", () => {
  const ast = parseInput("x^n*y^m");
  const variables = ast.accept(analyzer);
  deriver.variables = variables;
  const derivation = ast.accept(deriver);

  const derivationAST = parseInput(derivation.derivatives["y"]);
  const result = derivationAST.accept(optimizer);
  expect(result.exprString).toBe("(x^n)*(y^m*(m/y))");
});

