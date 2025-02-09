import { TOKENS } from './lexer.js'
import { EaselError } from './stdlib.js'

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
        const token = this.eat(this.peekType())
        switch (token.type) {
            case TOKENS.String:
            case TOKENS.Number:
            case TOKENS.boolean: {
                return new Ast.Literal(token.content)
            }
        }
        this.error(token, "Expected expression but got " + token)
    }

    expr() {
        const left = this.simple()
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
}
