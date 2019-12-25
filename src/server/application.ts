/// <reference path="../index.d.ts" />
import { RouteHandle, VRequest, VResponse } from '../index.d';
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
        // const intercept = this.interceptStack.find(({ reg }: Intercept) => (<RegExp>reg).test(filePath));
        // if (intercept && intercept.handle) {
        //     Promise.resolve(intercept.handle(req, res)).then(vali => {
        //         if (vali) {
        //             this.router.handle(req, res);
        //         } else {
        //             console.log('###########');
        //             res.send('~~');
        //         }
        //     });

        //     return;
        // }
        this.router.handle(req, res);
    }
    useIntercept(path: string | Function, handle?: Function) {
        deprecate('please use `app.beforeUse` instead');
        this.beforeUse(path, handle);
        // if (!handle && typeof path == 'function') {
        //     handle = path;
        //     path = '/';
        // } else if (!handle && typeof path != 'function') {
        //     return;
        // }
        // this.interceptStack.push({
        //     path: path.toString(),
        //     reg: pathToRegexp(path.toString(), [], { end: false }),
        //     handle
        // });
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
                res.app = this;
                this.handle(req, res);
            }
        );
        return server.listen.call(server, port, ...args);
    }
}
export default Application;
