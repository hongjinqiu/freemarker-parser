//import ParamError from './errors/ParamError';
//import { ParamNames } from './Names';
//import { binaryOps, ECharCodes, isDecimalDigit, isIdentifierPart, isIdentifierStart, isWhitespace, literals, maxBinopLen, maxUnopLen, unaryOps, } from './utils/Chars';
function isIBiopInfo(object) {
    return object && 'prec' in object;
}
function isAllParamTypes(object) {
    return object && 'type' in object;
}
var binaryPrecedence = function (opVal) { return binaryOps[opVal] || 0; };
function createBinaryExpression(operator, left, right) {
    if (operator === '||' || operator === '&&') {
        return { type: ParamNames.LogicalExpression, operator: operator, left: left, right: right };
    }
    else {
        return { type: ParamNames.BinaryExpression, operator: operator, left: left, right: right };
    }
}
var ParamsParser = (function () {
    function ParamsParser() {
        this.expr = '';
        this.index = 0;
        this.length = 0;
    }
    ParamsParser.prototype.parse = function (expr) {
        this.expr = expr;
        this.index = 0;
        this.length = expr.length;
        var nodes = [];
        var chI;
        var node;
        while (this.index < this.length) {
            chI = this.charCodeAt(this.index);
            if (chI === ECharCodes.SEMCOL_CODE || chI === ECharCodes.COMMA_CODE) {
                this.index++;
            }
            else {
                node = this.parseExpression();
                if (node) {
                    nodes.push(node);
                }
                else if (this.index < this.length) {
                    throw new ParamError("Unexpected \"" + this.charAt(this.index) + "\"", this.index);
                }
            }
        }
        if (nodes.length === 1) {
            return nodes[0];
        }
        else {
            return {
                type: ParamNames.Compound,
                body: nodes
            };
        }
    };
    ParamsParser.prototype.charAt = function (i) {
        return this.expr.charAt(i);
    };
    ParamsParser.prototype.charCodeAt = function (i) {
        return this.expr.charCodeAt(i);
    };
    ParamsParser.prototype.parseSpaces = function () {
        var ch = this.charCodeAt(this.index);
        while (isWhitespace(ch)) {
            ch = this.charCodeAt(++this.index);
        }
    };
    ParamsParser.prototype.parseExpression = function () {
        var test = this.parseBinaryExpression();
        this.parseSpaces();
        return test;
    };
    ParamsParser.prototype.parseBinaryOp = function () {
        this.parseSpaces();
        var toCheck = this.expr.substr(this.index, maxBinopLen);
        var tcLen = toCheck.length;
        while (tcLen > 0) {
            if (binaryOps.hasOwnProperty(toCheck)) {
                this.index += tcLen;
                return toCheck;
            }
            toCheck = toCheck.substr(0, --tcLen);
        }
        return null;
    };
    ParamsParser.prototype.parseBinaryExpression = function () {
        var node;
        var biop;
        var prec;
        var stack;
        var biopInfo;
        var fbiop;
        var left;
        var right;
        var i;
        left = this.parseToken();
        biop = this.parseBinaryOp();
        if (!biop) {
            return left;
        }
        biopInfo = {
            value: biop,
            prec: binaryPrecedence(biop)
        };
        right = this.parseToken();
        if (!right || !left) {
            throw new ParamError("Expected expression after " + biop, this.index);
        }
        stack = [left, biopInfo, right];
        while (true) {
            biop = this.parseBinaryOp();
            if (!biop) {
                break;
            }
            prec = binaryPrecedence(biop);
            if (prec === 0) {
                break;
            }
            biopInfo = { value: biop, prec: prec };
            while (stack.length > 2) {
                fbiop = stack[stack.length - 2];
                if (!isIBiopInfo(fbiop) || prec > fbiop.prec) {
                    break;
                }
                right = stack.pop();
                stack.pop();
                left = stack.pop();
                if (!isAllParamTypes(right) || !isAllParamTypes(left)) {
                    break;
                }
                node = createBinaryExpression(fbiop.value, left, right);
                stack.push(node);
            }
            node = this.parseToken();
            if (!node) {
                throw new ParamError("Expected expression after " + biop, this.index);
            }
            stack.push(biopInfo, node);
        }
        i = stack.length - 1;
        node = stack[i];
        while (i > 1) {
            fbiop = stack[i - 1];
            left = stack[i - 2];
            if (!isIBiopInfo(fbiop) || !isAllParamTypes(left) || !isAllParamTypes(node)) {
                throw new ParamError("Expected expression", this.index);
            }
            node = createBinaryExpression(fbiop.value, left, node);
            i -= 2;
        }
        if (!isAllParamTypes(node)) {
            throw new ParamError("Expected expression", this.index);
        }
        return node;
    };
    ParamsParser.prototype.parseToken = function () {
        var ch;
        var toCheck;
        var tcLen;
        this.parseSpaces();
        ch = this.charCodeAt(this.index);
        if (isDecimalDigit(ch) || ch === ECharCodes.PERIOD_CODE) {
            return this.parseNumericLiteral();
        }
        else if (ch === ECharCodes.SQUOTE_CODE || ch === ECharCodes.DQUOTE_CODE) {
            return this.parseStringLiteral();
        }
        else if (isIdentifierStart(ch) || ch === ECharCodes.OPAREN_CODE) {
            return this.parseVariable();
        }
        else if (ch === ECharCodes.OBRACK_CODE) {
            return this.parseArray();
        }
        else {
            toCheck = this.expr.substr(this.index, maxUnopLen);
            tcLen = toCheck.length;
            while (tcLen > 0) {
                if (unaryOps.hasOwnProperty(toCheck)) {
                    this.index += tcLen;
                    return {
                        type: ParamNames.UnaryExpression,
                        operator: toCheck,
                        argument: this.parseToken(),
                        prefix: true
                    };
                }
                toCheck = toCheck.substr(0, --tcLen);
            }
        }
        return null;
    };
    ParamsParser.prototype.parseNumericLiteral = function () {
        var rawName = '';
        var ch;
        var chCode;
        while (isDecimalDigit(this.charCodeAt(this.index))) {
            rawName += this.charAt(this.index++);
        }
        if (this.charCodeAt(this.index) === ECharCodes.PERIOD_CODE) {
            rawName += this.charAt(this.index++);
            while (isDecimalDigit(this.charCodeAt(this.index))) {
                rawName += this.charAt(this.index++);
            }
        }
        ch = this.charAt(this.index);
        if (ch === 'e' || ch === 'E') {
            rawName += this.charAt(this.index++);
            ch = this.charAt(this.index);
            if (ch === '+' || ch === '-') {
                rawName += this.charAt(this.index++);
            }
            while (isDecimalDigit(this.charCodeAt(this.index))) {
                rawName += this.charAt(this.index++);
            }
            if (!isDecimalDigit(this.charCodeAt(this.index - 1))) {
                throw new ParamError("Expected exponent (" + rawName + this.charAt(this.index) + ")", this.index);
            }
        }
        chCode = this.charCodeAt(this.index);
        if (isIdentifierStart(chCode)) {
            throw new ParamError("Variable names cannot start with a number (" + rawName + this.charAt(this.index) + ")", this.index);
        }
        else if (chCode === ECharCodes.PERIOD_CODE) {
            throw new ParamError('Unexpected period', this.index);
        }
        return {
            type: ParamNames.Literal,
            value: parseFloat(rawName),
            raw: rawName
        };
    };
    ParamsParser.prototype.parseStringLiteral = function () {
        var str = '';
        var quote = this.charAt(this.index++);
        var closed = false;
        var ch;
        while (this.index < this.length) {
            ch = this.charAt(this.index++);
            if (ch === quote) {
                closed = true;
                break;
            }
            else if (ch === '\\') {
                ch = this.charAt(this.index++);
                switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;
                    default: str += "\\" + ch;
                }
            }
            else {
                str += ch;
            }
        }
        if (!closed) {
            throw new ParamError("Unclosed quote after \"" + str + "\"", this.index);
        }
        return {
            type: ParamNames.Literal,
            value: str,
            raw: quote + str + quote
        };
    };
    ParamsParser.prototype.parseIdentifier = function () {
        var ch = this.charCodeAt(this.index);
        var start = this.index;
        var identifier;
        if (isIdentifierStart(ch)) {
            this.index++;
        }
        else {
            throw new ParamError("Unexpected " + this.charAt(this.index), this.index);
        }
        while (this.index < this.length) {
            ch = this.charCodeAt(this.index);
            if (isIdentifierPart(ch)) {
                this.index++;
            }
            else {
                break;
            }
        }
        identifier = this.expr.slice(start, this.index);
        if (literals.hasOwnProperty(identifier)) {
            return {
                type: ParamNames.Literal,
                value: literals[identifier],
                raw: identifier
            };
        }
        else {
            return {
                type: ParamNames.Identifier,
                name: identifier
            };
        }
    };
    ParamsParser.prototype.parseArguments = function (termination) {
        var chI;
        var args = [];
        var node;
        var closed = false;
        while (this.index < this.length) {
            this.parseSpaces();
            chI = this.charCodeAt(this.index);
            if (chI === termination) {
                closed = true;
                this.index++;
                break;
            }
            else if (chI === ECharCodes.COMMA_CODE) {
                this.index++;
            }
            else {
                node = this.parseExpression();
                if (!node || node.type === ParamNames.Compound) {
                    throw new ParamError('Expected comma', this.index);
                }
                args.push(node);
            }
        }
        if (!closed) {
            throw new ParamError("Expected " + String.fromCharCode(termination), this.index);
        }
        return args;
    };
    ParamsParser.prototype.parseVariable = function () {
        var chI;
        chI = this.charCodeAt(this.index);
        var node = chI === ECharCodes.OPAREN_CODE
            ? this.parseGroup()
            : this.parseIdentifier();
        this.parseSpaces();
        chI = this.charCodeAt(this.index);
        while (chI === ECharCodes.PERIOD_CODE || chI === ECharCodes.OBRACK_CODE || chI === ECharCodes.OPAREN_CODE) {
            this.index++;
            if (chI === ECharCodes.PERIOD_CODE) {
                this.parseSpaces();
                node = {
                    type: ParamNames.MemberExpression,
                    computed: false,
                    object: node,
                    property: this.parseIdentifier()
                };
            }
            else if (chI === ECharCodes.OBRACK_CODE) {
                node = {
                    type: ParamNames.MemberExpression,
                    computed: true,
                    object: node,
                    property: this.parseExpression()
                };
                this.parseSpaces();
                chI = this.charCodeAt(this.index);
                if (chI !== ECharCodes.CBRACK_CODE) {
                    throw new ParamError('Unclosed [', this.index);
                }
                this.index++;
            }
            else if (chI === ECharCodes.OPAREN_CODE) {
                node = {
                    type: ParamNames.CallExpression,
                    arguments: this.parseArguments(ECharCodes.CPAREN_CODE),
                    callee: node
                };
            }
            this.parseSpaces();
            chI = this.charCodeAt(this.index);
        }
        return node;
    };
    ParamsParser.prototype.parseGroup = function () {
        this.index++;
        var node = this.parseExpression();
        this.parseSpaces();
        if (this.charCodeAt(this.index) === ECharCodes.CPAREN_CODE) {
            this.index++;
            return node;
        }
        else {
            throw new ParamError('Unclosed (', this.index);
        }
    };
    ParamsParser.prototype.parseArray = function () {
        this.index++;
        return {
            type: ParamNames.ArrayExpression,
            elements: this.parseArguments(ECharCodes.CBRACK_CODE)
        };
    };
    return ParamsParser;
}());
//export { ParamsParser };
//# sourceMappingURL=ParamsParser.js.map