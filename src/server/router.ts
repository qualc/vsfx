/// <reference path="../index.d.ts" />
import { RouteHandle, VRequest, VResponse } from '../index.d';
import url from 'url';
import statuses from 'statuses';
import pathRegexp, { pathToRegexp } from 'path-to-regexp';
import Application from './application';

type Route = {
    method: string;
    reg?: RegExp;
    path: string;
    handle: RouteHandle;
    keys: Array<pathRegexp.Key>;
    params: {
        [key: string]: any;
    };
};

class Router {
    private stack: Array<Route> = [];
    private beforeStack: Array<Route> = [];
    private afterStack: Array<Route> = [];
    private app: Application;
    constructor(app: Application) {
        this.app = app;
    }
    use(...args: any[]) {
        let method: string, path: string, handle: RouteHandle;
        if (args.length === 3) {
            [method, path, handle] = args;
        } else if (args.length === 2) {
            [path, handle] = args;
            method = 'all';
        } else {
            method = 'all';
            path = '/';
            handle = args[0] || function() {};
        }
        const route: Route = {
            method: method.toLocaleLowerCase(),
            path,
            handle,
            keys: [],
            params: {}
        };
        route.reg = pathToRegexp(path, route.keys, { end: true });
        this.stack.push(route);
    }
    useMiddleware(path: string | RouteHandle, ...argv: [RouteHandle | number, number]) {
        let handle, type;
        if (typeof path == 'function') {
            handle = path;
            path = '/';
            type = argv[0];
        } else if (typeof path == 'string') {
            [handle, type] = argv;
        }
        const route: Route = {
            method: 'all',
            path,
            handle: <RouteHandle>handle,
            keys: [],
            params: {}
        };
        route.reg = pathToRegexp(path, route.keys, { end: false });
        if (type == 1) {
            this.beforeStack.push(route);
        } else {
            this.afterStack.push(route);
        }
    }
    match(route: Route, path: string) {
        const { reg } = route;
        let match = (path && reg && reg.exec(path)) || false;
        if (!match) {
            return false;
        }
        let { keys, params } = route;
        for (let i = 1; i < match.length; i++) {
            const key = (keys[i - 1] || {}).name;
            // 如果 val 是字符串, 就 decodeURIComponent 一下
            let val = match[i];
            if (typeof val == 'string') {
                val = decodeURIComponent(val);
            }
            if (val !== undefined || !Object.hasOwnProperty.call(params, key)) {
                params[key] = val;
            }
        }
        route.params = params;
        return true;
    }
    handle(req: VRequest, res: VResponse) {
        const { afterStack, beforeStack, stack } = this;
        const stacks: Array<Route> = [...beforeStack, ...stack, ...afterStack],
            path = req.url ? url.parse(req.url).pathname : null;
        let index = 0;
        if (path == null) {
            // 这里响应err
            throw Error('path是空的');
        }
        const method = req.method?.toLocaleLowerCase();
        // 简单的 express洋葱模型
        const next = (err?: Error) => {
            if (err) {
                res.statusCode = 500;
                res.end(err.stack);
                return;
            }
            let match: any = null,
                route = <Route>{};
            while (match !== true && index < stacks.length) {
                route = stacks[index++];
                if (!route) {
                    continue;
                }
                if (!method || (route.method !== 'all' && method !== route.method)) {
                    continue;
                }
                match = this.match(route, path);
                if (match !== true) {
                    continue;
                }
            }
            if (match && route) {
                try {
                    req.params = route.params || {};
                    route.handle(req, res, next);
                } catch (e) {
                    res.statusCode = 500;
                    res.end(e.stack);
                }
            } else {
                const code = 404;
                res.statusCode = code;
                res.end(statuses[code] || String(code));
            }
        };
        next();
    }
}
export default Router;
