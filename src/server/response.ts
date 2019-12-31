/// <reference path="../../vsfx.d.ts" />
import { VRequest } from '../../vsfx';
import { ServerResponse } from 'http';
import fs from 'fs';
import mime from 'mime';
import fresh from 'fresh';
import statuses from 'statuses';
import Application from './application';
import { setCharset } from './util';

export default class ServerResponseCustom extends ServerResponse {
    req: VRequest = <VRequest>{};
    app: Application = <Application>{};
    private _isSend = false;
    status(code: number) {
        this.statusCode = code;
        return this;
    }
    sendStatus(code: number) {
        var body = statuses[code] || String(code);
        this.statusCode = code;
        this.contentType('txt');
        return this.send(body);
    }
    send(chunk: any) {
        if (this._isSend) return;
        this._isSend = true;
        let encoding: BufferEncoding | undefined;
        const type = this.getHeader('Content-Type');
        switch (typeof chunk) {
            case 'string':
                if (!type) {
                    this.setHeader('Content-Type', setCharset('application/json', 'utf-8') || '');
                }
                break;
            case 'boolean':
            case 'number':
            case 'object':
                if (chunk === null) {
                    chunk = '';
                } else if (Buffer.isBuffer(chunk)) {
                    if (!type) {
                        this.setHeader('Content-Type', setCharset('bin') || '');
                    }
                } else {
                    chunk = JSON.stringify(chunk);
                    if (!type) {
                        this.setHeader('Content-Type', setCharset('application/json', 'utf-8') || '');
                    }
                }
                break;
        }
        if (chunk !== undefined) {
            let len = 0;
            if (Buffer.isBuffer(chunk)) {
                len = chunk.length;
            } else {
                chunk = Buffer.from(chunk, encoding);
                encoding = undefined;
                len = chunk.length;
            }
            this.set('Content-Length', len.toString());
        }
        const ETagFn = this.app.config['etag fn'];
        if (!this.getHeader('ETag') && typeof ETagFn == 'function') {
            const etag = ETagFn(chunk, encoding);
            this.setHeader('ETag', etag);
        }
        this.end(chunk);
        return this;
    }
    sendFile(filePath: string) {
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(this);
    }
    json(chunk: any) {
        chunk = JSON.stringify(chunk);
        if (!this.getHeader('Content-Type')) {
            this.set('Content-Type', 'application/json');
        }
        return this.send(chunk);
    }
    set(field: string, value: string) {
        if (field.toLowerCase() === 'content-type') {
            if (!/;\s*charset\s*=/.test(value)) {
                var charset = mime.getType(value.split(';')[0]);
                if (charset) value += '; charset=' + charset.toLowerCase();
            }
        }
        this.setHeader(field, value);
    }
    contentType(value: string) {
        this.set('Content-Type', value);
    }
    get fresh() {
        const { method, headers } = this.req;
        var res = this;
        var status = res.statusCode;

        if ('GET' !== method && 'HEAD' !== method) return false;

        if ((status >= 200 && status < 300) || 304 === status) {
            return fresh(headers, {
                etag: res.getHeader('ETag'),
                'last-modified': res.getHeader('Last-Modified')
            });
        }
        return false;
    }
}
