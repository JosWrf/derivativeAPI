// Transforms expressions of the form expr1^expr2 to exp(expr2*ln(expr1))
// -> x^x can be derived

import { BinaryAST, ExprAST, FuncAST, SymbolAST, UnaryAST } from "./ast.js";
import { TokenType, Token } from "./token.js";

class ASTTransformer {

    visitSymbol(symbolNode) {
        return new SymbolAST(symbolNode.value);
    }

    visitExpr(exprNode) {
        return new ExprAST(exprNode.expr.accept(this));
    }

    visitFunc(funcNode) {
        return new FuncAST(funcNode.expr.accept(this), funcNode.func);
    }

    visitBinary(binaryNode) {
        const left = binaryNode.left.accept(this);
        const right = binaryNode.right.accept(this);
        if (binaryNode.operator === TokenType.POW){
            const ln = new FuncAST(left, new Token(TokenType.LN, "ln"));
            const bin = new BinaryAST(right, ln, TokenType.MULT);
            const newNode = new FuncAST(bin, new Token(TokenType.EXP, "exp"));
            return newNode;
        }
        return new BinaryAST(left, right, binaryNode.operator);
    }

    visitUnary(unaryNode) {
        return new UnaryAST(unaryNode.expr.accept(this));
    }
}

export { ASTTransformer };