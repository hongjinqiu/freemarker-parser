//import NodeError from './errors/NodeError';
//import { Tokenizer } from './Tokenizer';
//import { cProgram } from './utils/Node';
//import { addNodeChild, canAddChildren, isPartial, tokenToNodeType } from './utils/Token';
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.parse = function (template) {
        var ast = cProgram(0, template.length);
        var stack = [];
        var parent = ast;
        var tokenizer = new Tokenizer();
        var tokens = tokenizer.parse(template);
        if (tokens.length === 0) {
            return { ast: ast, tokens: tokens };
        }
        var token = null;
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            token = tokens_1[_i];
            var tokenType = tokenToNodeType(token);
            if (token.isClose) {
                if (token.params) {
                    throw new NodeError("Close tag '" + token.type + "' should not have params", token);
                }
                if (parent.type !== tokenType) {
                    throw new NodeError("Unexpected close tag '" + token.type + "'", token);
                }
                parent = stack.pop();
            }
            else {
                var node = addNodeChild(parent, token);
                if (node !== parent && canAddChildren(node)) {
                    if (!isPartial(tokenType, parent.type)) {
                        stack.push(parent);
                    }
                    parent = node;
                }
            }
        }
        if (stack.length > 0) {
            var el = stack.pop();
            throw new NodeError("Unclosed tag '" + el.type + "'", el);
        }
        return { ast: ast, tokens: tokens };
    };
    return Parser;
}());
//export { Parser };
//# sourceMappingURL=Parser.js.map