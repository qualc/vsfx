"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var fs_1 = __importDefault(require("fs"));
var mime_1 = __importDefault(require("mime"));
var fresh_1 = __importDefault(require("fresh"));
var statuses_1 = __importDefault(require("statuses"));
var util_1 = require("./util");
var ServerResponseCustom = /** @class */ (function (_super) {
    __extends(ServerResponseCustom, _super);
    function ServerResponseCustom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.req = {};
        _this.app = {};
        _this._isSend = false;
        return _this;
    }
    ServerResponseCustom.prototype.status = function (code) {
        this.statusCode = code;
        return this;
    };
    ServerResponseCustom.prototype.sendStatus = function (code) {
        var body = statuses_1.default[code] || String(code);
        this.statusCode = code;
        this.contentType('txt');
        return this.send(body);
    };
    ServerResponseCustom.prototype.send = function (chunk) {
        if (this._isSend)
            return;
        this._isSend = true;
        var encoding;
        var type = this.getHeader('Content-Type');
        switch (typeof chunk) {
            case 'string':
                if (!type) {
                    this.setHeader('Content-Type', util_1.setCharset('application/json', 'utf-8') || '');
                }
                break;
            case 'boolean':
            case 'number':
            case 'object':
                if (chunk === null) {
                    chunk = '';
                }
                else if (Buffer.isBuffer(chunk)) {
                    if (!type) {
                        this.setHeader('Content-Type', util_1.setCharset('bin') || '');
                    }
                }
                else {
                    chunk = JSON.stringify(chunk);
                    if (!type) {
                        this.setHeader('Content-Type', util_1.setCharset('application/json', 'utf-8') || '');
                    }
                }
                break;
        }
        if (chunk !== undefined) {
            var len = 0;
            if (Buffer.isBuffer(chunk)) {
                len = chunk.length;
            }
            else {
                chunk = Buffer.from(chunk, encoding);
                encoding = undefined;
                len = chunk.length;
            }
            this.set('Content-Length', len.toString());
        }
        var ETagFn = this.app.config['etag fn'];
        if (!this.getHeader('ETag') && typeof ETagFn == 'function') {
            var etag = ETagFn(chunk, encoding);
            this.setHeader('ETag', etag);
        }
        this.end(chunk);
        return this;
    };
    ServerResponseCustom.prototype.sendFile = function (filePath) {
        var readStream = fs_1.default.createReadStream(filePath);
        readStream.pipe(this);
    };
    ServerResponseCustom.prototype.json = function (chunk) {
        chunk = JSON.stringify(chunk);
        if (!this.getHeader('Content-Type')) {
            this.set('Content-Type', 'application/json');
        }
        return this.send(chunk);
    };
    ServerResponseCustom.prototype.set = function (field, value) {
        if (field.toLowerCase() === 'content-type') {
            if (!/;\s*charset\s*=/.test(value)) {
                var charset = mime_1.default.getType(value.split(';')[0]);
                if (charset)
                    value += '; charset=' + charset.toLowerCase();
            }
        }
        this.setHeader(field, value);
    };
    ServerResponseCustom.prototype.contentType = function (value) {
        this.set('Content-Type', value);
    };
    Object.defineProperty(ServerResponseCustom.prototype, "fresh", {
        get: function () {
            var _a = this.req, method = _a.method, headers = _a.headers;
            var res = this;
            var status = res.statusCode;
            if ('GET' !== method && 'HEAD' !== method)
                return false;
            if ((status >= 200 && status < 300) || 304 === status) {
                return fresh_1.default(headers, {
                    etag: res.getHeader('ETag'),
                    'last-modified': res.getHeader('Last-Modified')
                });
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ServerResponseCustom;
}(http_1.ServerResponse));
exports.default = ServerResponseCustom;
