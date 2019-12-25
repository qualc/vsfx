"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../global");
function assignMetadata(args, paramtype, index, data) {
    var _a;
    return __assign(__assign({}, args), (_a = {}, _a[paramtype + ":" + index] = {
        index: index
    }, _a));
}
exports.assignMetadata = assignMetadata;
var RouteParamtypes;
(function (RouteParamtypes) {
    RouteParamtypes[RouteParamtypes["REQUEST"] = 0] = "REQUEST";
    RouteParamtypes[RouteParamtypes["RESPONSE"] = 1] = "RESPONSE";
    RouteParamtypes[RouteParamtypes["NEXT"] = 2] = "NEXT";
    RouteParamtypes[RouteParamtypes["BODY"] = 3] = "BODY";
    RouteParamtypes[RouteParamtypes["QUERY"] = 4] = "QUERY";
    RouteParamtypes[RouteParamtypes["PARAM"] = 5] = "PARAM";
    RouteParamtypes[RouteParamtypes["HEADERS"] = 6] = "HEADERS";
    RouteParamtypes[RouteParamtypes["SESSION"] = 7] = "SESSION";
    RouteParamtypes[RouteParamtypes["FILE"] = 8] = "FILE";
    RouteParamtypes[RouteParamtypes["FILES"] = 9] = "FILES";
    RouteParamtypes[RouteParamtypes["IP"] = 10] = "IP";
})(RouteParamtypes = exports.RouteParamtypes || (exports.RouteParamtypes = {}));
var createParamsDecorator = function (paramtype) { return function (data) {
    return function (target, propertyKey, parameterIndex) {
        var args = Reflect.getMetadata(global_1.METHOD_PROTI_METADATA, target.constructor, propertyKey) || {};
        Reflect.defineMetadata(global_1.METHOD_PROTI_METADATA, assignMetadata(args, paramtype, parameterIndex, data), target.constructor, propertyKey);
    };
}; };
exports.Res = createParamsDecorator(RouteParamtypes.REQUEST);
