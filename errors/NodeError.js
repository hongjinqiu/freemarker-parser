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
var NodeError = (function (_super) {
    __extends(NodeError, _super);
    function NodeError(m, el) {
        var _this = _super.call(this, m) || this;
        _this.start = el.start;
        _this.end = el.end;
        Object.setPrototypeOf(_this, NodeError.prototype);
        return _this;
    }
    return NodeError;
}(Error));
//export default NodeError;
//# sourceMappingURL=NodeError.js.map