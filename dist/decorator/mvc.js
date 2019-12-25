"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var global_1 = require("../global");
exports.Controller = function (path) {
    return function (target) {
        Reflect.defineMetadata(global_1.CONTROLLER_METADATA, path, target);
    };
};
var createMethodsDecorator = function (method) { return function (path) {
    return function (target, key, descriptor) {
        Reflect.defineMetadata(global_1.CONTROLLER_METADATA, path, descriptor.value);
        Reflect.defineMetadata(global_1.METHOD_METADATA, method, descriptor.value);
    };
}; };
exports.Get = createMethodsDecorator('get');
exports.Post = createMethodsDecorator('post');
exports.default = {
    Controller: exports.Controller,
    Get: exports.Get,
    Post: exports.Post
};
