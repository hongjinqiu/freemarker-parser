var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ParamError = (function (_super) {
    __extends(ParamError, _super);
    function ParamError(message, start) {
        var _this = _super.call(this, message) || this;
        _this.description = message;
        _this.start = start;
        Object.setPrototypeOf(_this, ParamError.prototype);
        return _this;
    }
    return ParamError;
}(SyntaxError));
//export default ParamError;
//# sourceMappingURL=ParamError.js.map