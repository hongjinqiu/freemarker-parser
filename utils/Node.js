//import { NodeNames, ParamNames } from '../Names';
//import { paramParser, parseAssignParams } from './Params';
function cAssign(start, end, paramsText) {
    var params = parseAssignParams(start, end, paramsText);
    var body = params && params.length === 1 && params[0].type === ParamNames.Identifier ? [] : undefined;
    return { type: NodeNames.Assign, start: start, end: end, params: params, body: body };
}
function cGlobal(start, end, paramsText) {
    var params = parseAssignParams(start, end, paramsText);
    var body = params && params.length === 1 && params[0].type === ParamNames.Identifier ? [] : undefined;
    return { type: NodeNames.Global, start: start, end: end, params: params, body: body };
}
function cLocal(start, end, paramsText) {
    var params = parseAssignParams(start, end, paramsText);
    var body = params && params.length === 1 && params[0].type === ParamNames.Identifier ? [] : undefined;
    return { type: NodeNames.Local, start: start, end: end, params: params, body: body };
}
function cCondition(start, end, params) {
    return { type: NodeNames.Condition, start: start, end: end, params: paramParser(start, end, params), consequent: [] };
}
function cList(start, end, params) {
    return { type: NodeNames.List, start: start, end: end, params: paramParser(start, end, params), body: [] };
}
function cMacro(start, end, params) {
    return { type: NodeNames.Macro, start: start, end: end, params: paramParser(start, end, params), body: [] };
}
function cProgram(start, end) {
    return { type: NodeNames.Program, start: start, end: end, body: [] };
}
function cMacroCall(name, start, end, endTag, params) {
    var body = endTag === '/>' ? undefined : [];
    return { type: NodeNames.MacroCall, start: start, end: end, name: name, params: paramParser(start, end, params), body: body };
}
function cText(text, start, end) {
    return { type: NodeNames.Text, start: start, end: end, text: text };
}
function cInclude(start, end, params) {
    return { type: NodeNames.Include, start: start, end: end, params: paramParser(start, end, params) };
}
function cInterpolation(start, end, params) {
    return { type: NodeNames.Interpolation, start: start, end: end, params: paramParser(start, end, params) };
}
function cAttempt(start, end) {
    return { type: NodeNames.Attempt, start: start, end: end, body: [] };
}
function cComment(text, start, end) {
    return { type: NodeNames.Comment, start: start, end: end, text: text };
}
function cSwitch(start, end, params) {
    return { type: NodeNames.Switch, start: start, end: end, params: paramParser(start, end, params), cases: [] };
}
function cSwitchCase(start, end, params) {
    return { type: NodeNames.SwitchCase, start: start, end: end, params: paramParser(start, end, params), consequent: [] };
}
function cSwitchDefault(start, end) {
    return { type: NodeNames.SwitchDefault, start: start, end: end, consequent: [] };
}
function cBreak(start, end) {
    return { type: NodeNames.Break, start: start, end: end };
}
function cFunction(start, end, params) {
    return { type: NodeNames.Function, start: start, end: end, params: paramParser(start, end, params), body: [] };
}
function cReturn(start, end, params) {
    return { type: NodeNames.Return, start: start, end: end, params: paramParser(start, end, params) };
}
function cToken(type, start, end, text, isClose, startTag, endTag, params) {
    return {
        type: type,
        start: start,
        end: end,
        startTag: startTag,
        endTag: endTag,
        text: text,
        params: params || undefined,
        isClose: isClose
    };
}
//# sourceMappingURL=Node.js.map