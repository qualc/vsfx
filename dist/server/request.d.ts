/// <reference types="node" />
import { VResponse } from '../../vsfx';
import { IncomingMessage } from 'http';
import qs from 'querystring';
import Application from './application';
export default class IncomingMessageCustom extends IncomingMessage {
    res: VResponse | undefined;
    app: Application;
    body: any;
    log(msg: any): void;
    get query(): qs.ParsedUrlQuery;
}
