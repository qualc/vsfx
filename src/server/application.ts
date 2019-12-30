/// <reference path="../index.d.ts" />
// import { RouteHandle, VRequest, VResponse } from '../index.d';
import http from 'http';
import path from 'path';
import depd from 'depd';
import fs from 'fs';
import etag from 'etag';
import { pathToRegexp } from 'path-to-regexp';
import IncomingMessageCustom from './request';
import ServerResponseCustom from './response';
import Router from './router';
const deprecate = depd('vsfx');

type Config = {
    [key: string]: any;
};
type Intercept = {
    path?: string;
    reg?: RegExp;
    handle?: Function;
};

class Application {
    config: Config = {};
    private router: Router;
    private staticStack: RegExp[] = [];
    private interceptStack: Intercept[] = [];
    private catchFn: Function | undefined = undefined;
    constructor() {
        this.router = new Router(this);
        this.defaultConfiguration();
    }
    private defaultConfiguration() {
        this.config['etag fn'] = this.getEtagFn();
    }
    private getEtagFn() {
        return (body: any, encoding?: BufferEncoding) => {
            var buf = !Buffer.isBuffer(body) ? Buffer.from(body, encoding) : body;
            return etag(buf, { weak: true });
        };
    }
    private handle(req: VRequest, res: VResponse) {
        const filePath: string = req.url || '';
        const isStatic = this.staticStack.some(reg => reg.test(filePath));
        if (isStatic) {
            const fullFilePath = path.join(process.cwd(), filePath);
            const state = fs.statSync(fullFilePath);
            if (state.isFile()) {
                res.sendFile(fullFilePath);
                return;
            }
        }
        this.router.handle(req, res);
    }
    catch(handle: Function) {
        this.catchFn = handle;
    }
    useIntercept(path: string | Function, handle?: Function) {
        deprecate('please use app.beforeUse inserted');
        if (typeof path == 'function') {
            handle = path;
            path = '/';
        }
        this.router.useMiddleware(path, <RouteHandle>handle, 0);
        // if (typeof path == 'function') {
        //     handle = path;
        //     path = '/';
        // }
        // const reg = pathToRegexp(path, [], { end: false });
        // this.interceptStack.push({ path, handle, reg });
    }
    static(filePath: string) {
        this.staticStack.push(pathToRegexp(filePath, [], { end: false }));
    }
    use(...args: any[]) {
        if (args.length == 3) {
            // [method, path, handle] = args;
            this.router.use(args[0], args[1], args[2]);
        } else {
            this.router.use('all', args[0], args[1]);
        }
    }
    beforeUse(path: any, handle?: any) {
        if (typeof path == 'function') {
            handle = path;
            path = '/';
        }
        this.router.useMiddleware(path, <RouteHandle>handle, 1);
    }
    afterUse(path: any, handle?: RouteHandle) {
        if (typeof path == 'function') {
            handle = path;
            path = '/';
        }
        this.router.useMiddleware(path, <RouteHandle>handle, 2);
    }
    listen(port: number = 3000, ...args: any[]) {
        const server = http.createServer(
            {
                IncomingMessage: IncomingMessageCustom,
                ServerResponse: ServerResponseCustom
            },
            (req, res) => {
                req.res = res;
                res.req = req;
                req.app = this;
                res.app = this;
                this.handle(req, res);
            }
        );
        return server.listen.call(server, port, ...args);
    }
}
export default Application;
