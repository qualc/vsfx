"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var global_1 = require("../global");
exports.Controller = function (path, opts) {
    return function (target) {
        var metadata = Reflect.getOwnMetadata(global_1.CONTROLLER_METADATA, global_1.CONTROLLER_METADATA_OBJ) || [];
        metadata.push({
            path: path,
            target: target,
            opts: opts
        });
        Reflect.defineMetadata(global_1.CONTROLLER_METADATA, metadata, global_1.CONTROLLER_METADATA_OBJ);
    };
};
