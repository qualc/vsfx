"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = __importDefault(require("url"));
var querystring_1 = __importDefault(require("querystring"));
var IncomingMessageCustom = /** @class */ (function (_super) {
    __extends(IncomingMessageCustom, _super);
    function IncomingMessageCustom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.app = {};
        _this.body = {};
        return _this;
    }
    IncomingMessageCustom.prototype.log = function (msg) {
        console.log(JSON.stringify(msg));
    };
    Object.defineProperty(IncomingMessageCustom.prototype, "query", {
        get: function () {
            var queryStr = url_1.default.parse(this.url || '').query;
            return queryStr ? querystring_1.default.parse(queryStr) : {};
        },
        enumerable: true,
        configurable: true
    });
    return IncomingMessageCustom;
}(http_1.IncomingMessage));
exports.default = IncomingMessageCustom;
