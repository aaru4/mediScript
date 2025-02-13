import { Ast } from './ast.js'
import { TOKENS } from './lexer.js'
import { EaselError } from './stdlib.js'

const opOrder = {
    '<': 0,
    '<=': 0,
    '>': 0,
    '>=': 0,
    '!==': 0,
    '==': 0,
    '&&': 0,
    '||': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
}

const isOp = type =>
    [
        TOKENS.Or,
        TOKENS.And,
        TOKENS.Equiv,
        TOKENS.NotEquiv,
        TOKENS.Gt,
        TOKENS.Gte,
        TOKENS.Lt,
        TOKENS.Lte,
        TOKENS.Plus,
        TOKENS.Minus,
        TOKENS.Asterisk,
        TOKENS.Slash
    ].includes(type)

export class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.ast = []
        this.current = 0
    }

    error(token, msg) {
        throw new EaselError(
            `Syntax error on ${token.line}:${token.column}: ${msg}`
        )
    }

    peek() {
        if (this.current >= this.tokens.length) return
        return this.tokens[this.current]
    }

    peekType() {
        if (this.current >= this.tokens.length) return
        return this.tokens[this.current].type
    }

    parse() {
        while (this.peekType() !== TOKENS.EOF) this.ast.push(this.stmt())
        return this.ast
    }

    eat(type) {
        if (this.peekType() == type) return this.tokens[this.current++]
        this.error(
            this.peek(),
            `Expected ${type} but got ${this.peekType().toString()}`
        )
    }

    simple() {
        let token = this.eat(this.peekType())
            switch (token.type) {
                case TOKENS.String:
                case TOKENS.Number:
                case TOKENS.boolean: {
                    return new Ast.Literal(token.content)
                }
                case TOKENS.LeftBracket: {
                    let items = []
                    if (this.peekType() !== TOKENS.RightBracket) items = this.exprList()
                        this.eat(TOKENS.RightBracket)
                    return new Ast.Array(items)
                }
                case TOKENS.Identifier: {
                    return new Ast.Var(token.value)
                }
                case TOKENS.LeftParen: {
                    const expr = this.expr()
                    this.eat(TOKENS.RightParen)
                    return expr
                }
            }
            this.error(token, "Expected expression but got " + token)
        }

    expr() {
        let left = this.simple()
        if (isOp(this.peekType())) {
            const op = this.eat(this.peekType()).value
            let right = this.expr()
            if (right instanceof Ast.Binary && opOrder[op] > opOrder[right.operator])
                return new Ast.Binary(
                    new Ast.Binary(left, op, right.left),
                    right.operator,
                    right.right
                )
            return new Ast.Binary(left, op, right) 
            }       
        return left
    }

    stmt() {
        const next = this.peek()
        switch (next.type) {
            default: {
                return this.expr()
            }
        }
    }

    exprList() {
        let exprs = []
        exprs.push(this.expr())
        while (this.peekType() == TOKENS.Comma) {
            this.eat(TOKENS.Comma)
            exprs.push(this.expr())
        }
        return exprs
    }
}

export class Array {
    constructor(value) {
        this.type = 'Array'
        this.value = value
    }
}

export class Binary {
    constructor(left, operator, right) {
        this.type = 'Binary'
        this.left = left
        this.operator = operator
        this.right = right
    }
}

export default {
    Array,
    Binary
}