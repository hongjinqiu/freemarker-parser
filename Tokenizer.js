//import NodeError from './errors/NodeError';
//import ParamError from './errors/ParamError';
//import { ENodeType, symbols } from './Symbols';
//import { chrMatrix, ECharCodes, isLetter, isWhitespace } from './utils/Chars';
//import { cToken } from './utils/Node';
var Tokenizer = (function () {
    function Tokenizer() {
        this.template = '';
        this.tokens = [];
        this.cursorPos = 0;
    }
    Tokenizer.prototype.parse = function (template) {
        this.template = template;
        this.tokens = [];
        this.cursorPos = 0;
        while (this.cursorPos >= 0 && this.cursorPos < this.template.length) {
            this.parseToken();
        }
        return this.tokens;
    };
    Tokenizer.prototype.getNextPos = function (items) {
        var pos = -1;
        var text = '';
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var n = this.template.indexOf(item, this.cursorPos);
            if (n >= 0 && (pos === -1 || n < pos)) {
                pos = n;
                text = item;
            }
        }
        return { pos: pos, text: text };
    };
    Tokenizer.prototype.parseTag = function () {
        var text = '';
        var ch = this.charCodeAt(this.cursorPos);
        while (this.cursorPos < this.template.length) {
            if (isWhitespace(ch)) {
                ++this.cursorPos;
                break;
            }
            if (ch === ECharCodes.GREATER_THAN || (ch === ECharCodes.SLASH && this.charCodeAt(this.cursorPos + 1) === ECharCodes.GREATER_THAN)) {
                break;
            }
            if (isLetter(ch) || ch === ECharCodes.PERIOD_CODE) {
                text += this.charAt(this.cursorPos);
                ch = this.charCodeAt(++this.cursorPos);
            }
            else {
                throw new ParamError("Invalid `" + this.charAt(this.cursorPos) + "`", this.cursorPos);
            }
        }
        return text;
    };
    Tokenizer.prototype.getToken = function () {
        var symbol = null;
        var startPos = 0;
        for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var item = symbols_1[_i];
            var n = this.template.indexOf(item.startToken, this.cursorPos);
            if (n >= 0 && (!symbol || n < startPos)) {
                symbol = item;
                startPos = n;
            }
        }
        return symbol || null;
    };
    Tokenizer.prototype.parseToken = function () {
        var text = '';
        var startPos = this.cursorPos;
        var ch;
        while (this.cursorPos < this.template.length) {
            ch = this.charCodeAt(this.cursorPos);
            if (ch === ECharCodes.LESS_THAN || ch === ECharCodes.DOLAR) {
                var token = this.getToken();
                if (token) {
                    if (text.length > 0) {
                        this.addToken(ENodeType.Text, startPos, this.cursorPos, text);
                        text = '';
                    }
                    var start = this.cursorPos;
                    this.cursorPos += token.startToken.length;
                    switch (token.type) {
                        case ENodeType.Comment:
                            return this.parseComment(token.startToken, token.endToken, start);
                        case ENodeType.Directive:
                            return this.parseDirective(token.startToken, token.endToken, start, Boolean(token.end));
                        case ENodeType.Macro:
                            return this.parseMacro(token.startToken, token.endToken, start, Boolean(token.end));
                        case ENodeType.Interpolation:
                            return this.parseInterpolation(token.startToken, token.endToken, start);
                    }
                }
            }
            text += this.charAt(this.cursorPos);
            ++this.cursorPos;
        }
        return this.addToken(ENodeType.Text, startPos, this.cursorPos, text);
    };
    Tokenizer.prototype.addToken = function (type, start, end, text, startTag, endTag, params, isClose) {
        if (isClose === void 0) { isClose = false; }
        this.tokens.push(cToken(type, start, end, text, isClose, startTag, endTag, params));
    };
    Tokenizer.prototype.parseComment = function (startToken, endTokens, start) {
        var end = this.getNextPos(endTokens);
        if (end.pos === -1) {
            throw new ReferenceError("Unclosed comment");
        }
        var text = this.template.substring(this.cursorPos, end.pos);
        this.cursorPos = end.pos + end.text.length;
        this.addToken(ENodeType.Comment, start, this.cursorPos, text, startToken, end.text);
    };
    Tokenizer.prototype.parseInterpolation = function (startToken, endTokens, start) {
        var params = this.parseParams(endTokens);
        this.addToken(ENodeType.Interpolation, start, this.cursorPos, '', startToken, params.endToken, params.paramText);
    };
    Tokenizer.prototype.parseMacro = function (startToken, endTokens, start, isClose) {
        var typeString = this.parseTag();
        if (typeString.length === 0) {
            throw new ParamError('Macro name cannot be empty', this.cursorPos);
        }
        var params = this.parseParams(endTokens);
        this.addToken(ENodeType.Macro, start, this.cursorPos, typeString, startToken, params.endToken, params.paramText, isClose);
    };
    Tokenizer.prototype.parseDirective = function (startToken, endTokens, start, isClose) {
        var typeString = this.parseTag();
        if (typeString.length === 0) {
            throw new ParamError('Directive name cannot be empty', this.cursorPos);
        }
        var params = this.parseParams(endTokens);
        this.addToken(ENodeType.Directive, start, this.cursorPos, typeString, startToken, params.endToken, params.paramText, isClose);
    };
    Tokenizer.prototype.parseParams = function (endTags) {
        var paramText = '';
        var start = this.cursorPos;
        var stack = [];
        var lastCode;
        while (this.cursorPos <= this.template.length) {
            var ch = this.charCodeAt(this.cursorPos);
            if (lastCode !== ECharCodes.DQUOTE_CODE && lastCode !== ECharCodes.SQUOTE_CODE) {
                switch (ch) {
                    case ECharCodes.SQUOTE_CODE:
                    case ECharCodes.DQUOTE_CODE:
                    case ECharCodes.OPAREN_CODE:
                    case ECharCodes.OBRACK_CODE:
                        if (lastCode) {
                            stack.push(lastCode);
                        }
                        lastCode = ch;
                        break;
                    case ECharCodes.CBRACK_CODE:
                    case ECharCodes.CPAREN_CODE:
                        if (!lastCode || ch !== chrMatrix[lastCode]) {
                            throw new NodeError("To many close tags " + String.fromCharCode(ch), { start: start, end: this.cursorPos });
                        }
                        lastCode = stack.pop();
                        break;
                }
            }
            else {
                switch (ch) {
                    case ECharCodes.SQUOTE_CODE:
                    case ECharCodes.DQUOTE_CODE:
                        if (lastCode === ch) {
                            lastCode = stack.pop();
                        }
                        break;
                }
            }
            if (!lastCode) {
                var nextPos = this.getNextPos(endTags);
                if (nextPos.pos !== -1 && this.cursorPos === nextPos.pos) {
                    this.cursorPos += nextPos.text.length;
                    return { paramText: paramText, endToken: nextPos.text };
                }
                else {
                    paramText += this.charAt(this.cursorPos);
                    ++this.cursorPos;
                }
            }
            else {
                paramText += this.charAt(this.cursorPos);
                ++this.cursorPos;
            }
        }
        if (lastCode) {
            throw new NodeError("Unclosed tag " + String.fromCharCode(lastCode), { start: start, end: this.cursorPos });
        }
        throw new NodeError("Unclosed directive or macro", { start: start, end: this.cursorPos });
    };
    Tokenizer.prototype.charAt = function (i) {
        return this.template.charAt(i);
    };
    Tokenizer.prototype.charCodeAt = function (i) {
        return this.template.charCodeAt(i);
    };
    return Tokenizer;
}());
//export { Tokenizer };
//# sourceMappingURL=Tokenizer.js.map