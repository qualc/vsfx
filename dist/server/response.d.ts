/// <reference types="node" />
/// <reference types="vsfx/src" />
import { VRequest } from '../index.d';
import { ServerResponse } from 'http';
import Application from './application';
export default class ServerResponseCustom extends ServerResponse {
    req: VRequest;
    app: Application;
    private _isSend;
    status(code: number): this;
    sendStatus(code: number): this | undefined;
    send(chunk: any): this | undefined;
    sendFile(filePath: string): void;
    json(chunk: any): this | undefined;
    set(field: string, value: string): void;
    contentType(value: string): void;
    get fresh(): boolean;
}
