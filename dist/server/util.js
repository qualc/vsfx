"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var content_type_1 = __importDefault(require("content-type"));
exports.setCharset = function setCharset(type, charset) {
    if (!type || !charset) {
        return type;
    }
    var parsed = content_type_1.default.parse(type);
    parsed.parameters.charset = charset;
    return content_type_1.default.format(parsed);
};
exports.default = {
    setCharset: exports.setCharset
};
