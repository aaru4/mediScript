export const TOKENS = {
    LeftParen: 'LeftParen', 
    RightParen: 'RightParen', 
    LeftBrace: 'LeftBrace',
    RightBrace: 'RightBrace', 
    LeftBracket: 'LeftBracket', 
    RightBracket: 'RightBracket', 
    Period: 'Period',
    Comma: 'Comma',
    Colon: 'Colon',
    Keyword: 'Keyword',
    Identifier: 'Identifier',
    String: 'String',
    Number: 'Number',
    Or: 'Or',
    Not: 'Not',
    And: 'And',
    Equiv: 'Equiv', 
    NotEquiv: 'NotEquiv',
    Gt: 'Gt',
    Gte: 'Gte',
    Lt: 'Lt',
    Lte: 'Lte',
    Plus: 'Plus',
    Minus: 'Minus',
    Asterisk: 'Asterisk',
    Slash: 'Slash',
    EOF: 'EOF'
}

export class Token {
    constructor(type, value, content, line, column) {
        this.type = type
        this.value = value
        this.content = content
        this.line = line
        this.column = column
}

toString() {
    return this.value
    }
}


export class Lexer {
    constructor(program) {
        this.program = program
        this.tokens = []
        this.current = 0
        this.line = 1
        this.column = 0
    }

    error(msg) {
        throw newEaselError(`Error on ${this.line}:${this.column}: ${msg}`)
    }
}