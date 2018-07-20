//import NodeError from '../errors/NodeError';
//import { ParamNames } from '../Names';
//import { ParamsParser } from '../ParamsParser';
function cIdentifier(name) {
    return { type: ParamNames.Identifier, name: name };
}
function parseAssignParams(start, end, params) {
    if (!params) {
        throw new NodeError('Assign require params', { start: start, end: end });
    }
    var values = [];
    var pars = params.trim().split(/\s*[,\n\r]+\s*/);
    for (var _i = 0, pars_1 = pars; _i < pars_1.length; _i++) {
        var item = pars_1[_i];
        if (!item) {
            throw new NodeError('Assign empty assign', { start: start, end: end });
        }
        var match = item.match(/^([a-zA-Z\.]+)\s*((=|-=|\*=|\/=|%=|\+=)\s*(.*))?$/i);
        if (!match) {
            match = item.match(/^\s*(\+\+|--)?([a-zA-Z.]+)(\+\+|--)?\s*$/i);
            if (match && match[2] && (match[1] || match[3])) {
                values.push({
                    type: ParamNames.UpdateExpression,
                    operator: match[1] || match[3],
                    prefix: Boolean(match[1]),
                    argument: cIdentifier(match[2])
                });
                continue;
            }
            throw new NodeError('Assign invalid character', { start: start, end: end });
        }
        var operator = match[3];
        var data = match[4];
        if (operator && data) {
            values.push({
                type: ParamNames.AssignmentExpression,
                operator: operator,
                left: cIdentifier(match[1]),
                right: paramParser(start, end, data)
            });
        }
        else {
            var parsee = paramParser(start, end, item);
            if (parsee) {
                values.push(parsee);
            }
            else {
                throw new NodeError('Assign invalid character', { start: start, end: end });
            }
        }
    }
    if (values.length > 1 && values.some(function (item) { return item.type === ParamNames.Identifier; })) {
        throw new NodeError('Wrong parameters', { start: start, end: end });
    }
    return values.length > 0 ? values : undefined;
}
function paramParser(start, end, params) {
    if (params) {
        var parser = new ParamsParser();
        try {
            return parser.parse(params);
        }
        catch (e) {
            throw new NodeError(e.message, { start: start + e.start, end: end });
        }
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=Params.js.map