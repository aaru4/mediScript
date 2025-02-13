import { Ast } from './ast.js'
import { TOKENS } from './lexer.js'
import { EaselError } from './stdlib.js'

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
        while (this.peekType() !== TOKENS.EOF) continue
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
            }
            this.error(token, "Expected expression but got " + token)
        }

    expr() {
        const left = this.simple()
        if (isOp(this.peekType()).value) {
            const op = this.eat(this.peekType()).value
            const right = this.expr()
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

export default {
    Array,
}