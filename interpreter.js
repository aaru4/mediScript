import { EaselError } from '.stdlib.js'

export class Interpreter {
    error(msg) {
        throw new EaselError(`Runtime error: ${msg}`)
    }

    run(ast, scope)

    inScope(scope, name) {
        return Object.keys(scope).includes(name)
    }
    evaluate(value, scope) {
        switch (value.constructor) {
          case Ast.Var:
            if (!this.inScope(scope, value.name))
              this.error(`${value.name} is not defined in current scope`)
            return scope[value.name]
          case Ast.Instance:
            if (!this.inScope(scope, value.name))
              this.error(`${value.name} is not defined in current scope`)
    
            const constructor = scope[value.name]
            let members = {}
            for (let [member, memberValue] of Object.entries(value.members))
              members[member] = this.evaluate(memberValue, scope)
            return constructor(members)
          case Ast.Call: {
            const caller = this.evaluate(value.caller, scope)
            if (!caller) this.error('Caller did not resolve to a defined value')
            let args = []
            for (let arg of value.args) args.push(this.evaluate(arg, scope))
            return caller(args)
          }
          case Ast.Get:
            const caller = this.evaluate(value.caller, scope)
    
            let get
            if (value.isExpr) get = caller[this.evaluate(value.property, scope)]
            else get = caller[value.property]
    
            if (get instanceof Function) return get.bind(caller)
            return get
          case Ast.Unary: {
            const operations = { '!': apply => !apply }
            return operations[value.operator](this.evaluate(value.apply, scope))
          }
          case Ast.Binary:
            const operations = {
              '<': (left, right) => left < right,
              '<=': (left, right) => left <= right,
              '>': (left, right) => left > right,
              '>=': (left, right) => left >= right,
              '!=': (left, right) => left != right,
              '==': (left, right) => left == right,
              '&&': (left, right) => left && right,
              '||': (left, right) => left || right,
              '+': (left, right) => left + right,
              '-': (left, right) => left - right,
              '*': (left, right) => left * right,
              '/': (left, right) => left / right
            }
            return operations[value.operator](
              this.evaluate(value.left, scope),
              this.evaluate(value.right, scope)
            )
          case Ast.Literal:
            return value.value
          case Ast.Array:
            return value.value.map(expr => this.evaluate(expr, scope))
          default:
            this.error('Expected expression but got statement')
        }
      }
    
    execute(node, scope) {
        switch(node.constructor) {
            case Ast.Var:
                scope[node.name] = this.evaluate(node.value, scope)
                return scope
            case Ast.Set:
            case Ast.Struct:
            case Ast.Func:
            case Ast.Return:
            case Ast.While:
            case Ast.For:
            case Ast.Conditional:
            default:
                this.evaluate(node, scope)
        }
        return scope
    }
}