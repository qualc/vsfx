/// <reference types="node" />
import { VResponse } from '../index.d';
import { IncomingMessage } from 'http';
import qs from 'querystring';
export default class IncomingMessageCustom extends IncomingMessage {
    res: VResponse | undefined;
    body: any;
    log(msg: any): void;
    get query(): qs.ParsedUrlQuery;
}
