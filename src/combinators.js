class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}

class Result {
  value;
  input;

  constructor(value, input) {
    this.value = value;
    this.input = input;
  }
}

function token(expectedType) {
  function innerToken(tokens) {
    if (expectedType === tokens[0].type) {
      return new Result(tokens[0], tokens.slice(1));
    } else {
      const message = `Expected type ${expectedType} but got ${tokens[0].type}`;
      throw new ParseError(message);
    }
  }

  return innerToken;
}

function concat(parser1, parser2) {
  function innerConcat(tokens) {
    const result = parser1(tokens);
    const newTokens = result.input;
    const result2 = parser2(newTokens);
    return new Result([result.value, result2.value], result2.input);
  }

  return innerConcat;
}

function alternative(parser1, parser2) {
  function innerAlternative(tokens) {
    try {
      return parser1(tokens);
    } catch (parseError) {
      return parser2(tokens);
    }
  }

  return innerAlternative;
}

function any(parsers) {
  function innerAny(tokens) {
    for (const parser of parsers) {
      try {
        return parser(tokens);
      } catch (error) {}
    }
    throw new ParseError("No parser matched.");
  }
  return innerAny;
}

export { token, concat, alternative, any };
