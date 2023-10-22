# API for calculating derivatives

Express API that can determine the derivative of a given multivariate function.

### Expression Grammar

```ebnf
linear         → factor ( ( "-" | "+" ) factor )* ;
factor         → power ( ( "/" | "*" ) power )* ;
power          → unary ( "^" unary )* ;
unary          → ( "-" ) unary | groupings ;
groupings      → functions | symbols | parentheses ;
parentheses    → "(" linear ")" ;
functions      → fname "(" linear ")" ;
symbols        → NUMBER | VAR ;

fname          → "cos"|"acos"|"sin"|"asin"|
                |"tan"|"atan"|"exp"|"ln" ;

```
