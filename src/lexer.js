import { Token, TokenType } from "./token.js";

class Lexer {
  #currPos = 0;
  #text = "";
  #functions = {
    cos: TokenType.COS,
    accos: TokenType.ACOS,
    sin: TokenType.SIN,
    asin: TokenType.ASIN,
    tan: TokenType.TAN,
    atan: TokenType.ATAN,
    exp: TokenType.EXP,
    ln: TokenType.LN,
  };

  isAtEnd() {
    return this.#currPos == this.#text.length;
  }

  isNumeric(char) {
    return !isNaN(parseInt(char));
  }

  isLetter(char) {
    return char.toLowerCase() != char.toUpperCase();
  }

  peak() {
    return this.#text[this.#currPos];
  }

  consume() {
    return this.#text[this.#currPos++];
  }

  consumeMultiple(n) {
    for (let i = 0; i < n; i++) {
      this.consume();
    }
  }

  handleNumbers() {
    const start = this.#currPos - 1;
    while (!this.isAtEnd() && this.isNumeric(this.peak())) {
      this.consume();
    }

    // Consumed the numeric input -> Either an operand or EOF is encountered for INT
    if (this.isAtEnd() || this.peak() != ".") {
      return new Token(TokenType.NUM, this.#text.slice(start, this.#currPos));
    }

    // Remove the "." and check for further integers
    this.consume();
    if (this.isAtEnd() || !this.isNumeric(this.peak())) {
      throw `Invalid Floating point number ${this.#text.slice(
        start,
        this.#currPos
      )}!`;
    }

    while (!this.isAtEnd() && this.isNumeric(this.peak())) {
      this.consume();
    }
    return new Token(TokenType.NUM, this.#text.slice(start, this.#currPos));
  }

  handleAlphabetic() {
    const start = this.#currPos - 1;
    for (const functionName of Object.keys(this.#functions)) {
      if (this.#text.startsWith(functionName, start)) {
        this.consumeMultiple(functionName.length - 1);
        return new Token(this.#functions[functionName], functionName);
      }
    }

    return new Token(TokenType.VAR, this.#text.slice(start, this.#currPos));
  }

  scan() {
    const currChar = this.consume();
    switch (currChar) {
      case "+":
        return new Token(TokenType.PLUS, currChar);
      case "-":
        return new Token(TokenType.MINUS, currChar);
      case "/":
        return new Token(TokenType.DIV, currChar);
      case "*":
        return new Token(TokenType.MULT, currChar);
      case "^":
        return new Token(TokenType.POW, currChar);
      case "(":
        return new Token(TokenType.OPPAR, currChar);
      case ")":
        return new Token(TokenType.CPAR, currChar);
      default:
        break;
    }
    if (this.isLetter(currChar)) {
      return this.handleAlphabetic();
    } else if (this.isNumeric(currChar)) {
      return this.handleNumbers();
    } else {
      throw `Invalid Character encountered ${currChar} at position ${
        this.#currPos
      } of the input.`;
    }
  }

  scanInput(text) {
    this.#currPos = 0;
    this.#text = text;
    const tokens = [];
    while (!this.isAtEnd()) {
      const token = this.scan();
      tokens.push(token);
    }
    tokens.push(new Token(TokenType.EOF, "EOF"));
    return tokens;
  }
}

export { Lexer };
