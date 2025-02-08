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

    peek() {
        if (this.current >= this.program.length) return '\0'
        return this.program[this.current]
    }

    scanTokens() {
        while (this.peek() !== '\0') this.scanTokens()
        this.tokens.push(new Token(TOKENS.EOF, null, null, this.line, this.column))
        return this.tokens
    }

    advance() {
        if (this.current >= this.program.length) return '\0'
        this.column++
        return this.program[this.current++]
    }

    scanToken() {
        const char = this.advance()

        switch (char) {
            case '(':
                return this.tokens.push(new Token(TOKENS.LeftParen, '(', '(', this.line, this.column))
            case ')':
                return this.tokens.push(new Token(TOKENS.RightParen, ')', ')', this.line, this.column))
            case '{':
                return this.tokens.push(new Token(TOKENS.LeftBrace, '{', '{', this.line, this.column))
            case '}':
                return this.tokens.push(new Token(TOKENS.RightBrace, '}', '}', this.line, this.column))
            case '[':
                return this.tokens.push(new Token(TOKENS.LeftBracket, '[', '[', this.line, this.column))
            case ']':
                return this.tokens.push(new Token(TOKENS.RightBracket, ']', ']', this.line, this.column))
            case '.':
                return this.tokens.push(new Token(TOKENS.Dot, '.', '.', this.line, this.column))
            case ',':
                return this.tokens.push(new Token(TOKENS.Comma, ',', ',', this.line, this.column))
            case ':':
                return this.tokens.push(new Token(TOKENS.Colon, ':', ':', this.line, this.column))
            case '+':
                return this.tokens.push(new Token(TOKENS.Plus, '+', '+', this.line, this.column))
            case '-':
                return this.tokens.push(new Token(TOKENS.Minus, '-', '-', this.line, this.column))
            case '*':
                return this.tokens.push(new Token(TOKENS.Asterisk, '*', '*', this.line, this.column))
            case '/':
                return this.tokens.push(new Token(TOKENS.Slash, '/', '/', this.line, this.column))
            case "'":
            case '"': {
                let str = []
                while (this.peek() !== char) {
                    str.push(this.advance())
                    if (this.peek() == '\0')
                        this.error("Unexpected end of file; expected a closing quote")
                }
                this.advance()
                str = str.join('')
                return this.tokens.push(
                    new Token(TOKENS.String, String, String, this.line, this.column)
                )      
            }
        }
    }
}