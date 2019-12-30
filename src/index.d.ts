import http from 'http';
import pathRegexp, { pathToRegexp } from 'path-to-regexp';
import Router from './server/router';

declare type Config = {
    [key: string]: any;
};

type Query = {
    [key: string]: any;
};
export type Params = Query;
export type Body = Query;
export type NextFunction = (err?: any) => void;
export type RouteHandle = (req: VRequest, res: VResponse, next?: NextFunction) => void;
export type VRequest = http.IncomingMessageCustom;
export type VResponse = http.ServerResponseCustom;

declare global {
    export type NextFunction = (err?: any) => void;
    export type RouteHandle = (req: VRequest, res: VResponse, next?: NextFunction) => void;
    export type VRequest = http.IncomingMessageCustom;
    export type VResponse = http.ServerResponseCustom;
}

export interface VApplication {
    config: Config;
    beforeUse(path: string): void;
    beforeUse(path: string, handle: RouteHandle): void;
    use(path: string, handle: RouteHandle): void;
    use(method: string, path: string, handle: RouteHandle): void;
}
export type Route = {
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

declare module 'http' {
    class IncomingMessageCustom extends IncomingMessage {
        set res(res: VResponse);
        log(msg: any): void;
        app: VApplication;
        get query(): Query;
        params: Params;
        body: Body;
        route: Route;
    }
    class ServerResponseCustom extends ServerResponse {
        req: VRequest;
        app: VApplication;
        send(body: Body | string): void;
        sendFile(filePath: string): void;
    }
    type RequestListenerCustom = (req: IncomingMessageCustom, res: ServerResponseCustom) => void;

    function createServer(requestListener?: RequestListenerCustom): Server;
    function createServer(options: ServerOptions, requestListener?: RequestListenerCustom): Server;
}

declare module 'vsfx' {
    function DefineRoute(path: String): void;
    function use(path: string, handle: RouteHandle): void;
    function use(method: string, path: string, handle: RouteHandle): void;
}
