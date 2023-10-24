import { TokenType } from "./token.js";

class Subexpression {
    isConstant;
    exprString;

    constructor(exprString, isConstant) {
        this.exprString = exprString;
        this.isConstant = isConstant;
    }
}

class ExprOptimizer {
    visitSymbol(symbolNode) {
        return new Subexpression(symbolNode.value.lexeme, symbolNode.value.type === TokenType.NUM);
    }

    visitExpr(exprNode) {
        const subexpr = exprNode.expr.accept(this);
        return new Subexpression("(" + subexpr.exprString + ")", subexpr.isConstant);
    }

    visitFunc(funcNode) {
        const subexpr = funcNode.expr.accept(this);
        return new Subexpression(funcNode.func.lexeme + "(" + subexpr.exprString + ")", false);
    }

    visitBinary(binaryNode) {
        const left = binaryNode.left.accept(this);
        const right = binaryNode.right.accept(this);
        const operator = binaryNode.operator;

        return OptimizeBinary.optimize(left, right, operator);
    }

    visitUnary(unaryNode) {
        const subexpr = unaryNode.expr.accept(this);
        const newString = subexpr.isConstant && parseFloat(subexpr.exprString) === 0 ? subexpr.exprString : "-" + subexpr.exprString;
        return new Subexpression(newString, subexpr.isConstant);
    }
}

// Constants are aggregated
applyOperator = (operator, left, right) => {
    let result;
    switch (operator) {
        case TokenType.PLUS:
            result = parseFloat(left) + parseFloat(right);
            break;
        case TokenType.MINUS:
            result = parseFloat(left) - parseFloat(right);
            break;
        case TokenType.MULT:
            result = parseFloat(left) * parseFloat(right);
            break;
        case TokenType.DIV:
            result = parseFloat(left) / parseFloat(right);
            break;
        case TokenType.POW:
            result = parseFloat(left) ** parseFloat(right);
            break;
    }
    return result >= 0 ? `${result}` : `(${result})`;
}



class OptimizeBinary {
    static optimize(left, right, operator) {
        let subExpr = left.exprString + operator + right.exprString;
        const leftExpr = !left.isConstant ? left : left.exprString.replace(/[()]/g, "");
        const rightExpr = !right.isConstant ? right : right.exprString.replace(/[()]/g, "");

        if (left.isConstant && right.isConstant) {
            return new Subexpression(applyOperator(operator, leftExpr, rightExpr), true);
        }

        if (left.exprString === right.exprString && operator === TokenType.DIV){
            return new Subexpression("1", true);
        }

        const isLeftZero = left.isConstant && parseFloat(leftExpr) === 0;
        const isRightZero = right.isConstant && parseFloat(rightExpr) === 0;
        const isLeftOne = left.isConstant && parseFloat(leftExpr) === 1;
        const isRightOne = right.isConstant && parseFloat(rightExpr) === 1;

        if (isRightOne && [TokenType.MULT, TokenType.DIV, TokenType.POW].includes(operator)){
            return new Subexpression(left.exprString, false);
        }
        else if (isLeftOne && operator === TokenType.MULT){
            return new Subexpression(right.exprString, false);
        }
        else if (isRightZero){
            switch (operator) {
                case TokenType.MULT:
                    return new Subexpression("0", true);
                case TokenType.POW:
                    return new Subexpression("1", true);
                case TokenType.MINUS:
                case TokenType.PLUS:
                    return new Subexpression(left.exprString, false);
            }
        }
        else if (isLeftZero){
            switch (operator) {
                case TokenType.DIV:
                case TokenType.MULT:
                    return new Subexpression("0", true);
                case TokenType.MINUS:
                    return new Subexpression("-" + "(" + right.exprString + ")", false) 
                case TokenType.PLUS:
                    return new Subexpression(right.exprString, false);
            }
        }

        return new Subexpression(subExpr, false);
    }
}

export { ExprOptimizer };