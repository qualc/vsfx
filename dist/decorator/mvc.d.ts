import 'reflect-metadata';
export declare const Interceptors: (isInterceptors?: Boolean) => ClassDecorator;
export declare const Controller: (path?: string, opts?: object) => ClassDecorator;
export declare const Service: (serviceName?: string | undefined) => ClassDecorator;
export declare const Get: (path: string, opts?: object) => MethodDecorator;
export declare const Post: (path: string, opts?: object) => MethodDecorator;
declare const _default: {
    Controller: (path?: string, opts?: object) => ClassDecorator;
    Service: (serviceName?: string | undefined) => ClassDecorator;
    Get: (path: string, opts?: object) => MethodDecorator;
    Post: (path: string, opts?: object) => MethodDecorator;
    Interceptors: (isInterceptors?: Boolean) => ClassDecorator;
};
export default _default;
