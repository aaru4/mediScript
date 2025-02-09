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
}