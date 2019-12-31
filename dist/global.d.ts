export declare const METHOD_METADATA: unique symbol;
export declare const CONTROLLER_METADATA: unique symbol;
export declare const SERVICE_METADATA: unique symbol;
export declare const METHOD_PROTI_METADATA: unique symbol;
export declare const SERVICE_OBJ: {};
export declare type Class = any;
export declare type DecoratorOpts = {
    [k: string]: any;
};
export declare type METHODDATA = {
    path: string;
    opts: DecoratorOpts;
    method: string;
    fnName: string;
    value: Function;
};
export declare type METHODDATAS = METHODDATA[] | undefined;
