import { VResponse } from '../index.d';
import { IncomingMessage } from 'http';
import url from 'url';
import qs from 'querystring';

export default class IncomingMessageCustom extends IncomingMessage {
    public res: VResponse | undefined;
    body: any = {};
    log(msg: any) {
        console.log(JSON.stringify(msg));
    }
    get query() {
        const queryStr = url.parse(this.url || '').query;
        return queryStr ? qs.parse(queryStr) : {};
    }
}
