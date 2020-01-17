/// <reference path="../../vsfx.d.ts" />
import { RouteHandle, VRequest, VResponse } from '../../vsfx';
import pathRegexp from 'path-to-regexp';
import Application from './application';
declare type Route = {
    method: string;
    reg?: RegExp;
    path: string;
    handle: RouteHandle;
    keys: Array<pathRegexp.Key>;
    type: number;
    params: {
        [key: string]: any;
    };
};
declare class Router {
    private stack;
    private beforeStack;
    private afterStack;
    private interceptStack;
    private app;
    constructor(app: Application);
    use(...args: any[]): void;
    useMiddleware(path: string | RouteHandle, ...argv: [RouteHandle | number, number]): void;
    match(route: Route, path: string): boolean;
    handle(req: VRequest, res: VResponse): void;
}
export default Router;
