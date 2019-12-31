import { VResponse } from '../../vsfx';
import { IncomingMessage } from 'http';
import url from 'url';
import qs from 'querystring';
import Application from './application';

export default class IncomingMessageCustom extends IncomingMessage {
    public res: VResponse | undefined;
    app: Application = <Application>{};
    body: any = {};
    log(msg: any) {
        console.log(JSON.stringify(msg));
    }
    get query() {
        const queryStr = url.parse(this.url || '').query;
        return queryStr ? qs.parse(queryStr) : {};
    }
}
