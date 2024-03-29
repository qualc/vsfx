/// <reference types="node" />
import { RouteHandle } from '../../vsfx.d';
import http from 'http';
declare type Config = {
    [key: string]: any;
};
declare class Application {
    config: Config;
    private router;
    private staticStack;
    private interceptStack;
    private catchFn;
    constructor();
    private defaultConfiguration;
    private getEtagFn;
    private handle;
    catch(handle: Function): void;
    useIntercept(path: string | Function, handle?: Function): void;
    static(filePath: string): void;
    use(...args: any[]): void;
    beforeUse(path: any, handle?: any): void;
    afterUse(path: any, handle?: RouteHandle): void;
    listen(port?: number, ...args: any[]): http.Server;
}
export default Application;
