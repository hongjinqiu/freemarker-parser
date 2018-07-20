var ENodeType;
(function (ENodeType) {
    ENodeType["Program"] = "Program";
    ENodeType["Directive"] = "Directive";
    ENodeType["Macro"] = "Macro";
    ENodeType["Text"] = "Text";
    ENodeType["Interpolation"] = "Interpolation";
    ENodeType["Comment"] = "Comment";
})(ENodeType || (ENodeType = {}));
var symbols = [
    { startToken: '<#--', endToken: ['-->'], type: ENodeType.Comment, end: false },
    { startToken: '</#', endToken: ['>', '/>'], type: ENodeType.Directive, end: true },
    { startToken: '<#', endToken: ['>', '/>'], type: ENodeType.Directive, end: false },
    { startToken: '</@', endToken: ['>', '/>'], type: ENodeType.Macro, end: true },
    { startToken: '<@', endToken: ['>', '/>'], type: ENodeType.Macro, end: false },
    { startToken: '${', endToken: ['}'], type: ENodeType.Interpolation, end: false },
];
//# sourceMappingURL=Symbols.js.map