/// <reference types="vsfx/src" />
import { RouteHandle, VRequest, VResponse } from '../index.d';
import pathRegexp from 'path-to-regexp';
import Application from './application';
declare type Route = {
    method: string;
    reg?: RegExp;
    path: string;
    handle: RouteHandle;
    keys: Array<pathRegexp.Key>;
    params: {
        [key: string]: any;
    };
};
declare class Router {
    private stack;
    private beforeStack;
    private afterStack;
    private app;
    constructor(app: Application);
    use(...args: any[]): void;
    useMiddleware(path: string | RouteHandle, ...argv: [RouteHandle | number, number]): void;
    match(route: Route, path: string): boolean;
    handle(req: VRequest, res: VResponse): void;
}
export default Router;
