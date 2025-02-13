export class Literal {
    constructor(value) {
        this.type = 'Literal'
        this.value = value
    }
}

export class Var {
    constructor(name, value) {
        this.type = 'Var'
        this.name = name
        this.value = value
    }
}

export default {
    Literal,
    Var
}