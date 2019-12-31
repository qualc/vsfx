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
    type: number; // 0 route  1 before  2 after  3 intercept
    params: {
        [key: string]: any;
    };
};

class Router {
    private stack: Array<Route> = [];
    private beforeStack: Array<Route> = [];
    private afterStack: Array<Route> = [];
    private interceptStack: Array<Route> = [];
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
            type: 0,
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
            type,
            handle: <RouteHandle>handle,
            keys: [],
            params: {}
        };
        route.reg = pathToRegexp(path, route.keys, { end: false });
        if (type == 1) {
            this.beforeStack.push(route);
        } else if (type == 2) {
            this.afterStack.push(route);
        } else {
            this.interceptStack.push(route);
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
        const { afterStack, beforeStack, stack, interceptStack } = this;
        const stacks: Array<Route> = [...beforeStack, ...stack, ...afterStack],
            path = req.url ? url.parse(req.url).pathname : null;
        let index = 0;
        if (path == null) {
            // 这里响应err
            throw Error('path是空的');
        }
        const method = req.method?.toLocaleLowerCase();

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
                    req.route = route;
                    req.params = route.params || {};
                    // route.handle(req, res, next);
                    if (route.type === 0) {
                        req.params = route.params || {};
                        console.log('@@ 1', interceptStack.length, route);
                        if (interceptStack.length) {
                            let cindex = 0;
                            const next2 = (err?: Error) => {
                                if (err) {
                                    res.statusCode = 500;
                                    res.end(err.stack);
                                    return;
                                }
                                if (cindex == interceptStack.length) {
                                    route.handle(req, res, next);
                                    return;
                                }
                                let match: any = null,
                                    intercept = <Route>{};
                                while (match !== true && cindex < interceptStack.length) {
                                    intercept = interceptStack[cindex++];
                                    if (!intercept) {
                                        continue;
                                    }
                                    if (!method || (intercept.method !== 'all' && method !== intercept.method)) {
                                        continue;
                                    }
                                    match = this.match(intercept, path);
                                    if (match !== true) {
                                        continue;
                                    }
                                }
                                if (match && cindex <= interceptStack.length) {
                                    intercept.handle(req, res, next2);
                                } else if (cindex >= interceptStack.length) {
                                    route.handle(req, res, next);
                                }
                            };
                            next2();
                            return;
                        } else {
                            route.handle(req, res, next);
                        }
                    } else {
                        route.handle(req, res, next);
                    }
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
