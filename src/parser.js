import { alternative, concat, token, any } from "./combinators.js";
import { TokenType } from "./token.js";

function symbols() {
  return alternative(
    alternative(
      any([
        token(TokenType.COS),
        token(TokenType.ACOS),
        token(TokenType.SIN),
        token(TokenType.ASIN),
        token(TokenType.TAN),
        token(TokenType.ATAN),
        token(TokenType.EXP),
        token(TokenType.LN),
      ]),
      token(TokenType.VAR)
    ),
    token(TokenType.NUM)
  );
}

export { symbols };
