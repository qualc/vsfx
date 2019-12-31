"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../index.d.ts" />
// import { RouteHandle, VRequest, VResponse } from '../index.d';
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var depd_1 = __importDefault(require("depd"));
var fs_1 = __importDefault(require("fs"));
var etag_1 = __importDefault(require("etag"));
var path_to_regexp_1 = require("path-to-regexp");
var request_1 = __importDefault(require("./request"));
var response_1 = __importDefault(require("./response"));
var router_1 = __importDefault(require("./router"));
var deprecate = depd_1.default('vsfx');
var Application = /** @class */ (function () {
    function Application() {
        this.config = {};
        this.staticStack = [];
        this.interceptStack = [];
        this.catchFn = undefined;
        this.router = new router_1.default(this);
        this.defaultConfiguration();
    }
    Application.prototype.defaultConfiguration = function () {
        this.config['etag fn'] = this.getEtagFn();
    };
    Application.prototype.getEtagFn = function () {
        return function (body, encoding) {
            var buf = !Buffer.isBuffer(body) ? Buffer.from(body, encoding) : body;
            return etag_1.default(buf, { weak: true });
        };
    };
    Application.prototype.handle = function (req, res) {
        var filePath = req.url || '';
        var isStatic = this.staticStack.some(function (reg) { return reg.test(filePath); });
        if (isStatic) {
            var fullFilePath = path_1.default.join(process.cwd(), filePath);
            var state = fs_1.default.statSync(fullFilePath);
            if (state.isFile()) {
                res.sendFile(fullFilePath);
                return;
            }
        }
        this.router.handle(req, res);
    };
    Application.prototype.catch = function (handle) {
        this.catchFn = handle;
    };
    Application.prototype.useIntercept = function (path, handle) {
        deprecate('please use app.beforeUse inserted');
        if (typeof path == 'function') {
            handle = path;
            path = '/';
        }
        this.router.useMiddleware(path, handle, 0);
        // if (typeof path == 'function') {
        //     handle = path;
        //     path = '/';
        // }
        // const reg = pathToRegexp(path, [], { end: false });
        // this.interceptStack.push({ path, handle, reg });
    };
    Application.prototype.static = function (filePath) {
        this.staticStack.push(path_to_regexp_1.pathToRegexp(filePath, [], { end: false }));
    };
    Application.prototype.use = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length == 3) {
            // [method, path, handle] = args;
            this.router.use(args[0], args[1], args[2]);
        }
        else {
            this.router.use('all', args[0], args[1]);
        }
    };
    Application.prototype.beforeUse = function (path, handle) {
        if (typeof path == 'function') {
            handle = path;
            path = '/';
        }
        this.router.useMiddleware(path, handle, 1);
    };
    Application.prototype.afterUse = function (path, handle) {
        if (typeof path == 'function') {
            handle = path;
            path = '/';
        }
        this.router.useMiddleware(path, handle, 2);
    };
    Application.prototype.listen = function (port) {
        var _a;
        var _this = this;
        if (port === void 0) { port = 3000; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var server = http_1.default.createServer({
            IncomingMessage: request_1.default,
            ServerResponse: response_1.default
        }, function (req, res) {
            req.res = res;
            res.req = req;
            req.app = _this;
            res.app = _this;
            _this.handle(req, res);
        });
        return (_a = server.listen).call.apply(_a, __spreadArrays([server, port], args));
    };
    return Application;
}());
exports.default = Application;
