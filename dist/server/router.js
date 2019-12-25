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
var url_1 = __importDefault(require("url"));
var statuses_1 = __importDefault(require("statuses"));
var path_to_regexp_1 = require("path-to-regexp");
var Router = /** @class */ (function () {
    function Router(app) {
        this.stack = [];
        this.beforeStack = [];
        this.afterStack = [];
        this.app = app;
    }
    Router.prototype.use = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var method, path, handle;
        if (args.length === 3) {
            method = args[0], path = args[1], handle = args[2];
        }
        else if (args.length === 2) {
            path = args[0], handle = args[1];
            method = 'all';
        }
        else {
            method = 'all';
            path = '/';
            handle = args[0] || function () { };
        }
        var route = {
            method: method.toLocaleLowerCase(),
            path: path,
            handle: handle,
            keys: [],
            params: {}
        };
        route.reg = path_to_regexp_1.pathToRegexp(path, route.keys, { end: true });
        this.stack.push(route);
    };
    Router.prototype.useMiddleware = function (path) {
        var argv = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argv[_i - 1] = arguments[_i];
        }
        var handle, type;
        if (typeof path == 'function') {
            handle = path;
            path = '/';
            type = argv[0];
        }
        else if (typeof path == 'string') {
            handle = argv[0], type = argv[1];
        }
        var route = {
            method: 'all',
            path: path,
            handle: handle,
            keys: [],
            params: {}
        };
        route.reg = path_to_regexp_1.pathToRegexp(path, route.keys, { end: false });
        if (type == 1) {
            this.beforeStack.push(route);
        }
        else {
            this.afterStack.push(route);
        }
    };
    Router.prototype.match = function (route, path) {
        var reg = route.reg;
        var match = (path && reg && reg.exec(path)) || false;
        if (!match) {
            return false;
        }
        var keys = route.keys, params = route.params;
        for (var i = 1; i < match.length; i++) {
            var key = (keys[i - 1] || {}).name;
            // 如果 val 是字符串, 就 decodeURIComponent 一下
            var val = match[i];
            if (typeof val == 'string') {
                val = decodeURIComponent(val);
            }
            if (val !== undefined || !Object.hasOwnProperty.call(params, key)) {
                params[key] = val;
            }
        }
        route.params = params;
        return true;
    };
    Router.prototype.handle = function (req, res) {
        var _this = this;
        var _a;
        var _b = this, afterStack = _b.afterStack, beforeStack = _b.beforeStack, stack = _b.stack;
        var stacks = __spreadArrays(beforeStack, stack, afterStack), path = req.url ? url_1.default.parse(req.url).pathname : null;
        var index = 0;
        if (path == null) {
            // 这里响应err
            throw Error('path是空的');
        }
        var method = (_a = req.method) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase();
        // 简单的 express洋葱模型
        var next = function (err) {
            if (err) {
                res.statusCode = 500;
                res.end(err.stack);
                return;
            }
            var match = null, route = {};
            while (match !== true && index < stacks.length) {
                route = stacks[index++];
                if (!route) {
                    continue;
                }
                if (!method || (route.method !== 'all' && method !== route.method)) {
                    continue;
                }
                match = _this.match(route, path);
                if (match !== true) {
                    continue;
                }
            }
            if (match && route) {
                try {
                    req.params = route.params || {};
                    route.handle(req, res, next);
                }
                catch (e) {
                    res.statusCode = 500;
                    res.end(e.stack);
                }
            }
            else {
                var code = 404;
                res.statusCode = code;
                res.end(statuses_1.default[code] || String(code));
            }
        };
        next();
    };
    return Router;
}());
exports.default = Router;
