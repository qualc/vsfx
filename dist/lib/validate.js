"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = function (num) {
    return /^[-+]?\d+$/.test(num) /* && typeof num == 'number' */;
};
exports.isNotInteger = function (num) {
    return !exports.isInteger(num);
};
exports.isCompleteDate = function (date) {
    return /^[12][0-9]{3}-(([0][1-9])|([1][0-2]))-[0-3]\d( [0-2]\d:[0-5]\d:[0-5]\d)?$/.test(date);
};
exports.isNotCompleteDate = function (date) {
    return !exports.isCompleteDate(date);
};
exports.isUndefined = function (variable) {
    return typeof variable === "undefined";
};
exports.isNotUndefined = function (variable) {
    return !exports.isUndefined(variable);
};
exports.isEmpty = function (variable) {
    return variable == null || variable === undefined || variable === "";
};
exports.isNotEmpty = function (variable) {
    return !exports.isEmpty(variable);
};
exports.isFalse = function (variable) {
    if (typeof variable == "string") {
        variable = variable.replace(/\s/g, "");
    }
    return exports.isEmpty(variable) || variable == false || variable == 0;
};
exports.isNotFalse = function (variable) {
    return !exports.isFalse(variable);
};
exports.isEmail = function (email) {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email);
};
exports.isPhone = function (email) {
    return /^((\+86)|(86))?(1)[3458][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/.test(email);
};
exports.isHttp = function (variable) {
    return /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/.test(variable);
};
exports.isNotHttp = function (variable) {
    return !exports.isHttp(variable);
};
exports.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
};
exports.isString = function (obj) {
    return typeof obj == "string";
};
exports.isBoolean = function (obj) {
    return typeof obj == "boolean";
};
exports.isFunction = function (obj) {
    return typeof obj == "function";
};
exports.isArray = function (variable) {
    return Array.isArray(variable);
};
exports.isNotArray = function (variable) {
    return !Array.isArray(variable);
};
exports.default = {
    isInteger: exports.isInteger,
    isNotInteger: exports.isNotInteger,
    isCompleteDate: exports.isCompleteDate,
    isNotCompleteDate: exports.isNotCompleteDate,
    isUndefined: exports.isUndefined,
    isNotUndefined: exports.isNotUndefined,
    isEmpty: exports.isEmpty,
    isNotEmpty: exports.isNotEmpty,
    isFalse: exports.isFalse,
    isNotFalse: exports.isNotFalse,
    isEmail: exports.isEmail,
    isPhone: exports.isPhone,
    isHttp: exports.isHttp,
    isNotHttp: exports.isNotHttp,
    isObject: exports.isObject,
    isString: exports.isString,
    isBoolean: exports.isBoolean,
    isFunction: exports.isFunction,
    isArray: exports.isArray,
    isNotArray: exports.isNotArray
};
