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
var application_1 = __importDefault(require("./application"));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super.call(this) || this;
    }
    return App;
}(application_1.default));
var app = new App();
exports.use = app.use.bind(app);
exports.statics = app.static.bind(app);
exports.useIntercept = app.useIntercept.bind(app);
function server() {
    return app;
}
exports.default = server;
