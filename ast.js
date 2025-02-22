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

export class Func {
    constructor(name, params, body) {
        this.type = 'Func'
        this.name = name
        this.params = params
        this.body = body
    }
}

export class For {
    constructor(id, range, body) {
        this.type = 'For'
        this.id = id
        this.range = range
        this.body = body
    }
}

export class Return {
    constructor(value) {
        this.type = 'Return'
        this.value = value
    }
}

export class While {
    constructor(condition, body) {
        this.type = 'While'
        this.condition = condition
        this.body = body
    }
}

export class Conditional {
    constructor(condition, body, otherwise) {
        this.type = 'Conditional'
        this.condition = condition
        this.body = body
        this.otherwise = otherwise
    }
}

export class Set {
    constructor(caller, property, value) {
        this.type = 'Set'
        this.caller = caller
        this.property = property
        this.value = value
    }
}

export default {
    Literal, 
    Var,
    Func,
    Return, 
    For,
    While,
    Conditional,
    Set
}