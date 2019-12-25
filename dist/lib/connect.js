"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var server_1 = require("../server");
var global_1 = require("../global");
// Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'
// mapRoute(new SomeClass());
exports.DefineRoute = function (baseUrl, controllersPath) {
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
                classs_1.push.apply(classs_1, __explorer(cpaths));
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
            var controllerPath = _validatePath(baseUrl + Reflect.getMetadata(global_1.CONTROLLER_METADATA, item));
            mapRoute(new item(), controllerPath);
        });
    });
}
function mapRoute(instance, baseUrl) {
    var prototype = Object.getPrototypeOf(instance);
    // // 筛选出类的 methodName
    var methodsNames = Object.getOwnPropertyNames(prototype).filter(function (item) { return item !== 'constructor' && typeof prototype[item] === 'function'; });
    return methodsNames.map(function (methodName) {
        var handle = prototype[methodName];
        // 取出定义的 metadata
        var path = Reflect.getMetadata(global_1.CONTROLLER_METADATA, handle);
        var method = Reflect.getMetadata(global_1.METHOD_METADATA, handle);
        path = baseUrl + _validatePath(path);
        path = path.replace(/(\w+)\/$/, '');
        server_1.use(method, path, function (req, res, next) {
            handle.call(instance, req, res, next);
        });
        server_1.use(method, path, handle.bind(instance));
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
function __explorer(cpaths) {
    var classs = [];
    try {
        var files = fs.readdirSync(cpaths);
        files.forEach(function (file) {
            var _path = path.join(cpaths, file);
            try {
                var statInfo = fs.statSync(_path);
                if (statInfo.isDirectory()) {
                    classs.push.apply(classs, __explorer(_path));
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
        console.log("connect\u83B7\u53D6\u6587\u4EF6\u5931\u8D25\u5566~err:" + e.message);
    }
    return classs;
}
