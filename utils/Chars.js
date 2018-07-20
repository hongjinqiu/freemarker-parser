var _a;
var ECharCodes;
(function (ECharCodes) {
    ECharCodes[ECharCodes["TAB"] = 9] = "TAB";
    ECharCodes[ECharCodes["LINE_FEED"] = 10] = "LINE_FEED";
    ECharCodes[ECharCodes["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
    ECharCodes[ECharCodes["SPACE"] = 32] = "SPACE";
    ECharCodes[ECharCodes["HASH"] = 35] = "HASH";
    ECharCodes[ECharCodes["DOLAR"] = 36] = "DOLAR";
    ECharCodes[ECharCodes["PERIOD_CODE"] = 46] = "PERIOD_CODE";
    ECharCodes[ECharCodes["SLASH"] = 47] = "SLASH";
    ECharCodes[ECharCodes["COMMA_CODE"] = 44] = "COMMA_CODE";
    ECharCodes[ECharCodes["HYPHEN"] = 45] = "HYPHEN";
    ECharCodes[ECharCodes["SQUOTE_CODE"] = 39] = "SQUOTE_CODE";
    ECharCodes[ECharCodes["DQUOTE_CODE"] = 34] = "DQUOTE_CODE";
    ECharCodes[ECharCodes["OPAREN_CODE"] = 40] = "OPAREN_CODE";
    ECharCodes[ECharCodes["CPAREN_CODE"] = 41] = "CPAREN_CODE";
    ECharCodes[ECharCodes["OBRACK_CODE"] = 91] = "OBRACK_CODE";
    ECharCodes[ECharCodes["CBRACK_CODE"] = 93] = "CBRACK_CODE";
    ECharCodes[ECharCodes["SEMCOL_CODE"] = 59] = "SEMCOL_CODE";
    ECharCodes[ECharCodes["LESS_THAN"] = 60] = "LESS_THAN";
    ECharCodes[ECharCodes["GREATER_THAN"] = 62] = "GREATER_THAN";
    ECharCodes[ECharCodes["AT_SYMBOL"] = 64] = "AT_SYMBOL";
    ECharCodes[ECharCodes["OBRACE_CODE"] = 123] = "OBRACE_CODE";
    ECharCodes[ECharCodes["CBRACE_CODE"] = 125] = "CBRACE_CODE";
})(ECharCodes || (ECharCodes = {}));
var chrMatrix = (_a = {},
    _a[ECharCodes.DQUOTE_CODE] = ECharCodes.DQUOTE_CODE,
    _a[ECharCodes.OPAREN_CODE] = ECharCodes.CPAREN_CODE,
    _a[ECharCodes.OBRACE_CODE] = ECharCodes.CBRACK_CODE,
    _a[ECharCodes.OBRACK_CODE] = ECharCodes.CBRACK_CODE,
    _a);
var binaryOps = {
    '||': 1,
    '&&': 2,
    '^': 4,
    '&': 5,
    '==': 6, '!=': 6, '===': 6, '!==': 6,
    '<': 7, '>': 7, '<=': 7, '>=': 7, 'gt': 7, 'lt': 7, 'gte': 7, 'lte': 7,
    '+': 9, '-': 9,
    '*': 10, '/': 10, '%': 10
};
function isDecimalDigit(ch) {
    return ch >= 48 && ch <= 57;
}
function isLetter(ch) {
    return (ch >= 65 && ch <= 90) ||
        (ch >= 97 && ch <= 122);
}
function isWhitespace(ch) {
    return ch === ECharCodes.SPACE || ch === ECharCodes.TAB || ch === ECharCodes.CARRIAGE_RETURN || ch === ECharCodes.LINE_FEED;
}
function isIdentifierStart(ch) {
    return (isLetter(ch) ||
        (ch === 36) || (ch === 95) ||
        ch >= 128) && !binaryOps[String.fromCharCode(ch)];
}
function isIdentifierPart(ch) {
    return (isLetter(ch) ||
        isDecimalDigit(ch) ||
        (ch === 36) || (ch === 95) ||
        ch >= 128) && !binaryOps[String.fromCharCode(ch)];
}
var unaryOps = {
    '-': true,
    '!': true,
    '~': true,
    '+': true,
    '?': true,
    '--': true,
    '++': true
};
function getMaxKeyLen(obj) {
    var maxLen = 0;
    var len;
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        len = key.length;
        if (len > maxLen) {
            maxLen = len;
        }
    }
    return maxLen;
}
var maxUnopLen = getMaxKeyLen(unaryOps);
var maxBinopLen = getMaxKeyLen(binaryOps);
var literals = {
    "true": true,
    "false": false,
    "null": null
};
//# sourceMappingURL=Chars.js.map