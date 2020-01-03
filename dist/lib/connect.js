"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var depd_1 = __importDefault(require("depd"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var server_1 = require("../server");
var deprecate = depd_1.default('vsfx');
var global_1 = require("../global");
// Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'
// mapRoute(new SomeClass());
exports.defineRoute = function (baseUrl, controllersPath) {
    if (baseUrl && !controllersPath) {
        controllersPath = baseUrl;
        baseUrl = '/';
    }
    try {
        if (controllersPath && !Array.isArray(controllersPath)) {
            controllersPath = [controllersPath];
        }
        var classs_1 = [];
        if (controllersPath && Array.isArray(controllersPath)) {
            // 遍历挂载 controller
            controllersPath.forEach(function (cpaths) {
                classs_1.push.apply(classs_1, exports.recursionFile(cpaths));
            });
        }
        _defineMetadata(baseUrl.toString(), classs_1);
    }
    catch (e) {
        console.log("\u6709\u8DEF\u7531\u6302\u8F7D\u5931\u8D25\u5566:~err:" + e.stack);
    }
};
function _defineMetadata(baseUrl, classs) {
    classs.forEach(function (classItem) {
        Object.keys(classItem).map(function (key) {
            var item = classItem[key];
            var metadata = Reflect.getMetadata(global_1.CONTROLLER_METADATA, item);
            if (!metadata)
                return;
            var path = metadata.path, _a = metadata.opts, opts = _a === void 0 ? {} : _a;
            var controllerPath = _validatePath(baseUrl + path);
            mapRoute(new item(), controllerPath, opts);
        });
    });
}
var index = 0;
function mapRoute(instance, baseUrl, baseOpts) {
    var prototype = Object.getPrototypeOf(instance);
    // // 筛选出类的 methodName
    var methodsNames = Object.getOwnPropertyNames(prototype).filter(function (item) { return item !== 'constructor' && typeof prototype[item] === 'function'; });
    return methodsNames.map(function (methodName) {
        var handle = prototype[methodName];
        // 取出定义的 metadata
        var metadata = Reflect.getMetadata(global_1.CONTROLLER_METADATA, handle);
        var _a = metadata || {}, path = _a.path, _b = _a.opts, opts = _b === void 0 ? {} : _b, _type = _a._type;
        if (_type != 'method')
            return;
        var method = Reflect.getMetadata(global_1.METHOD_METADATA, handle);
        path = baseUrl + _validatePath(path);
        path = path.replace(/(\w+)\/$/, '');
        Object.assign(baseOpts, opts);
        server_1.use(method, path, function (req, res, next) {
            req.opts = Object.freeze(baseOpts);
            var interceptStack = req.app.interceptStack;
            if (interceptStack.length) {
                var cindex_1 = 0;
                var next2_1 = function (err) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.stack);
                        return;
                    }
                    if (cindex_1 == interceptStack.length) {
                        Resolve();
                        return;
                    }
                    var match = null, intercept = {};
                    while (match !== true && cindex_1 < interceptStack.length) {
                        intercept = interceptStack[cindex_1++];
                        if (!intercept) {
                            continue;
                        }
                        if (!method || (intercept.method !== 'all' && method !== intercept.method)) {
                            continue;
                        }
                        match = handleMatch(intercept, path);
                        if (match !== true) {
                            continue;
                        }
                    }
                    if (match && cindex_1 <= interceptStack.length) {
                        intercept.handle(req, res, next2_1);
                    }
                    else if (cindex_1 >= interceptStack.length) {
                        Resolve();
                    }
                };
                next2_1();
                return;
            }
            else {
                Resolve();
            }
            function Resolve() {
                Promise.resolve(handle.call(instance, req, res, next)).catch(function (err) {
                    var _a, _b;
                    if (typeof ((_a = req.app) === null || _a === void 0 ? void 0 : _a.catchFn) == 'function') {
                        (_b = req.app) === null || _b === void 0 ? void 0 : _b.catchFn(err, req, res, next);
                    }
                    else {
                        deprecate(err.stack);
                        res.sendStatus(500);
                    }
                });
            }
        });
        // use(method, path, handle.bind(instance));
        // return {
        //     path,
        //     method,
        //     handle,
        //     methodName
        // };
    });
}
function _validatePath(path) {
    if (!path)
        return '/';
    path = path.replace(/^(\/*)/, '/');
    return path;
}
// 递归加载 controller， 使其注入到 Reflect 中
exports.recursionFile = function (cpaths) {
    var classs = [];
    try {
        var files = fs.readdirSync(cpaths);
        files.forEach(function (file) {
            var _path = path.join(cpaths, file);
            try {
                var statInfo = fs.statSync(_path);
                if (statInfo.isDirectory()) {
                    classs.push.apply(classs, exports.recursionFile(_path));
                }
                else {
                    if (/\.[jt]s$/.test(path.parse(_path).ext)) {
                        classs.push(require(_path));
                    }
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    catch (e) {
        console.log("connect\u83B7\u53D6\u6587\u4EF6\u5931\u8D25\u5566~err:" + e.stack);
    }
    return classs;
};
function handleMatch(route, path) {
    console.log(route, path);
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
}
