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
require("reflect-metadata");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var server_1 = __importStar(require("./server"));
exports.use = server_1.use;
exports.useIntercept = server_1.useIntercept;
var connect_1 = require("./lib/connect");
exports.defineRoute = connect_1.defineRoute;
var decorator_1 = require("./decorator");
exports.Controller = decorator_1.Controller;
exports.Service = decorator_1.Service;
exports.Get = decorator_1.Get;
exports.Post = decorator_1.Post;
exports.Interceptors = decorator_1.Interceptors;
var cwd = process.cwd();
var vsfxJson = fs_1.default.readFileSync(path_1.default.join(cwd, 'vsfx.config.json')).toString();
if (vsfxJson) {
    try {
        vsfxJson = JSON.parse(vsfxJson);
        var base_1 = vsfxJson['base'] ? path_1.default.join(cwd, vsfxJson['base']) : cwd;
        var servicePath = vsfxJson['service'];
        if (servicePath) {
            if (Array.isArray(servicePath)) {
                servicePath.forEach(function (service) {
                    connect_1.recursionFile(path_1.default.join(base_1, service));
                });
            }
            else if (typeof servicePath === 'string') {
                connect_1.recursionFile(path_1.default.join(base_1, servicePath));
            }
        }
        var controllerPath = vsfxJson['controller'];
        if (controllerPath) {
            if (Array.isArray(controllerPath)) {
                controllerPath.forEach(function (controller) {
                    if (typeof controller === 'string') {
                        connect_1.defineRoute(path_1.default.join(base_1, controller));
                    }
                    else if (controller.path) {
                        var baseUrl = controller.base.toString() || '/';
                        connect_1.defineRoute(baseUrl, path_1.default.join(base_1, controller.path));
                    }
                });
            }
            else if (typeof controllerPath === 'string') {
                connect_1.defineRoute(path_1.default.join(base_1, controllerPath));
            }
        }
    }
    catch (err) {
        console.log('加载配置文件失败', err.stack);
    }
}
exports.default = server_1.default;
