var NodeNames;
(function (NodeNames) {
    NodeNames["Program"] = "Program";
    NodeNames["Else"] = "Else";
    NodeNames["Condition"] = "Condition";
    NodeNames["Include"] = "Include";
    NodeNames["List"] = "List";
    NodeNames["Text"] = "Text";
    NodeNames["Assign"] = "Assign";
    NodeNames["Global"] = "Global";
    NodeNames["Local"] = "Local";
    NodeNames["Macro"] = "Macro";
    NodeNames["MacroCall"] = "MacroCall";
    NodeNames["Interpolation"] = "Interpolation";
    NodeNames["Attempt"] = "Attempt";
    NodeNames["Recover"] = "Recover";
    NodeNames["Comment"] = "Comment";
    NodeNames["Switch"] = "Switch";
    NodeNames["SwitchCase"] = "SwitchCase";
    NodeNames["SwitchDefault"] = "SwitchDefault";
    NodeNames["Break"] = "Break";
    NodeNames["Function"] = "Function";
    NodeNames["Return"] = "Return";
    NodeNames["ConditionElse"] = "ConditionElse";
})(NodeNames || (NodeNames = {}));
var ParamNames;
(function (ParamNames) {
    ParamNames["Compound"] = "Compound";
    ParamNames["Identifier"] = "Identifier";
    ParamNames["MemberExpression"] = "MemberExpression";
    ParamNames["Literal"] = "Literal";
    ParamNames["CallExpression"] = "CallExpression";
    ParamNames["UnaryExpression"] = "UnaryExpression";
    ParamNames["BinaryExpression"] = "BinaryExpression";
    ParamNames["LogicalExpression"] = "LogicalExpression";
    ParamNames["ArrayExpression"] = "ArrayExpression";
    ParamNames["AssignmentExpression"] = "AssignmentExpression";
    ParamNames["UpdateExpression"] = "UpdateExpression";
})(ParamNames || (ParamNames = {}));
var directives = {
    "if": NodeNames.Condition,
    "else": NodeNames.Else,
    elseif: NodeNames.ConditionElse,
    list: NodeNames.List,
    include: NodeNames.Include,
    assign: NodeNames.Assign,
    attempt: NodeNames.Attempt,
    "function": NodeNames.Function,
    global: NodeNames.Global,
    local: NodeNames.Local,
    macro: NodeNames.Macro,
    recover: NodeNames.Recover,
    "return": NodeNames.Return,
    "switch": NodeNames.Switch,
    "case": NodeNames.SwitchCase,
    "default": NodeNames.SwitchDefault,
    "break": NodeNames.Break,
    noparse: NodeNames.Text,
    noParse: NodeNames.Text
};
//# sourceMappingURL=Names.js.map