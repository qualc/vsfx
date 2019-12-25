import http from 'http';
import Router from './server/router';

declare type Config = {
    [key: string]: any;
};

type Query = {
    [key: string]: any;
};
type Params = Query;
type Body = Query;
type NextFunction = (err?: any) => void;
type RouteHandle = (req: VRequest, res: VResponse, next?: NextFunction) => void;
type VRequest = http.IncomingMessageCustom;
type VResponse = http.ServerResponseCustom;

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

declare module 'http' {
    class IncomingMessageCustom extends IncomingMessage {
        set res(res: VResponse);
        log(msg: any): void;
        get query(): Query;
        params: Params;
        body: Body;
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
