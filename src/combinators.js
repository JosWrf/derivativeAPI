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

function map(parser, func) {
  function innerMap(tokens) {
    const result = parser(tokens);
    result.value = func(result.value);
    return result;
  }

  return innerMap;
}

function apply(func, parsers) {
  function innerApply(tokens) {
    const results = [];
    let currentInput = tokens;

    for (const parser of parsers) {
      const result = parser(currentInput);
      results.push(result.value);
      currentInput = result.input;
    }

    return new Result(func(...results), currentInput);
  }

  return innerApply;
}

function lazy(parserfunc) {
  function innerLazy(tokens) {
    return parserfunc()(tokens);
  }

  return innerLazy;
}

function repeat(parser) {
  function innerRepeat(tokens) {
    const results = [];
    let currentInput = tokens;

    try {
      while (true) {
        const result = parser(currentInput);
        results.push(result.value);
        currentInput = result.input;
      }
    } catch (error) {}

    return new Result(results, currentInput);
  }

  return innerRepeat;
}

function optional(parser) {
  function innerOptional(tokens) {
    try {
      return parser(tokens);
    } catch (error) {
      return new Result(null, tokens);
    }
  }

  return innerOptional;
}

function conditionalRepeat(condParser, thenParser) {
  function innerConditionalRepeat(tokens) {
    const results = [];
    let currentInput = tokens;

    while (true) {
      try {
        const result = condParser(currentInput);
        results.push(result.value);
        currentInput = result.input;
      } catch (error) {
        return new Result(results, currentInput);
      }
      const result = thenParser(currentInput);
      results.push(result.value);
      currentInput = result.input;
    }
  }

  return innerConditionalRepeat;
}

export {
  token,
  alternative,
  any,
  map,
  apply,
  lazy,
  repeat,
  optional,
  conditionalRepeat,
};
