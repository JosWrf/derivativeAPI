const TokenType = {
  EOF: "EOF",
  NUM: "Constant",
  VAR: "Variable",
  PLUS: "+",
  MINUS: "-",
  DIV: "/",
  MULT: "*",
  POW: "^",
  OPPAR: "(",
  CPAR: ")",
  COS: "cos",
  SIN: "sin",
  TAN: "tan",
  ACOS: "acos",
  ASIN: "asin",
  ATAN: "atan",
  EXP: "exp",
  LN: "ln",
};

class Token {
  constructor(type, lexeme) {
    this.type = type;
    this.lexeme = lexeme;
  }
}

export { Token, TokenType };
