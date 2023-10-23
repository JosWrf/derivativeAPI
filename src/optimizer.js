import { TokenType } from "./token.js";

class Subexpression {
    isConstant;
    exprString;
    parentheses;

    constructor(exprString, isConstant, parentheses = false) {
        this.exprString = exprString;
        this.isConstant = isConstant;
        this.parentheses = parentheses;
    }
}

//TODO: Check for each node, whether we can simplify the expression
class ExprOptimizer {
    visitSymbol(symbolNode) {
        return new Subexpression(symbolNode.value.lexeme, symbolNode.value.type === TokenType.NUM);
    }

    visitExpr(exprNode) {
        const subexpr = exprNode.expr.accept(this);
        return new Subexpression("(" + subexpr.exprString + ")", subexpr.isConstant, true);
    }

    visitFunc(funcNode) {
        const subexpr = exprNode.expr.accept(this);
        return new Subexpression(funcNode.value.lexeme + "(" + subexpr.exprString + ")", false);
    }

    visitBinary(binaryNode) {
        //TODO: Do heavy lifting here. Respect neutral elements, etc.

    }

    visitUnary(unaryNode) {
        const subexpr = unaryNode.expr.accept(this);
        const newString = subexpr.isConstant && parseFloat(subexpr.exprString) === 0 ? subexpr.exprString : "-" + subexpr.exprString;
        return new Subexpression(newString, subexpr.isConstant);
    }
}

export { ExprOptimizer };