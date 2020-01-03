"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var depd_1 = __importDefault(require("depd"));
var global_1 = require("../global");
var deprecate = depd_1.default('vsfx');
exports.Interceptors = function (isInterceptors) {
    if (isInterceptors === void 0) { isInterceptors = true; }
    deprecate("Modifiers '@interceptors()' are obsolete and will not work");
    return function (target) {
        var value = Reflect.getMetadata(global_1.CONTROLLER_METADATA, target) || {};
        if (!value.opts) {
            value.opts = {};
        }
        value.opts.interceptors = isInterceptors;
        Reflect.defineMetadata(global_1.CONTROLLER_METADATA, value, target);
    };
    // return (target, key, descriptor) => {
    //     if (target && key && descriptor) {
    //         let metadata = Reflect.getMetadata(CONTROLLER_METADATA, <any>descriptor.value);
    //         if (!metadata) {
    //             metadata = {};
    //             metadata.opts = {};
    //         } else if (metadata && !metadata.opts) {
    //             metadata.opts = {};
    //         }
    //         metadata.opts.interceptors = isInterceptors;
    //         Reflect.defineMetadata(CONTROLLER_METADATA, metadata, <any>descriptor.value);
    //     } else {
    //         const value = Reflect.getMetadata(CONTROLLER_METADATA, target) || {};
    //         if (!value.opts) {
    //             value.opts = {};
    //         }
    //         value.opts.interceptors = isInterceptors;
    //         Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
    //     }
    // };
};
exports.Controller = function (path, opts) {
    if (opts === void 0) { opts = {}; }
    return function (target) {
        var value = Reflect.getMetadata(global_1.CONTROLLER_METADATA, target) || {};
        value.path = path;
        if (!value.opts) {
            value.opts = {};
        }
        value.opts = Object.assign(value.opts, opts);
        Reflect.defineMetadata(global_1.CONTROLLER_METADATA, value, target);
    };
};
exports.Service = function (serviceName) {
    deprecate("Considering whether to implement decorator '@Service'");
    return function (target) {
        if (!serviceName) {
            Reflect.defineMetadata(global_1.SERVICE_METADATA, target, global_1.SERVICE_OBJ, target.name);
        }
        else {
            var serviceTarget = Reflect.getMetadata(global_1.SERVICE_METADATA, global_1.SERVICE_OBJ, serviceName);
            var value = {
                _type: 'proto'
            };
            Reflect.defineMetadata(global_1.CONTROLLER_METADATA, value, serviceTarget);
            target.prototype[serviceName] = new serviceTarget();
        }
    };
};
var createMethodsDecorator = function (method) { return function (path, opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, key, descriptor) {
        var value = {
            path: path,
            opts: opts,
            _type: 'method'
        };
        // Reflect.defineMetadata(CONTROLLER_METADATA, value, <any>descriptor.value);
        var metadata = Reflect.getMetadata(global_1.CONTROLLER_METADATA, descriptor.value);
        if (!metadata) {
            metadata = {
                path: path,
                _type: 'method',
                opts: opts
            };
        }
        else if (metadata && !metadata.opts) {
            metadata.opts = {};
        }
        Object.assign(metadata.opts, opts);
        Reflect.defineMetadata(global_1.CONTROLLER_METADATA, metadata, descriptor.value);
        Reflect.defineMetadata(global_1.METHOD_METADATA, method, descriptor.value);
    };
}; };
exports.Get = createMethodsDecorator('get');
exports.Post = createMethodsDecorator('post');
exports.default = {
    Controller: exports.Controller,
    Service: exports.Service,
    Get: exports.Get,
    Post: exports.Post,
    Interceptors: exports.Interceptors
};
