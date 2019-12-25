export const METHOD_METADATA = Symbol('method');
export const CONTROLLER_METADATA = Symbol('controller');
export const METHOD_PROTI_METADATA = Symbol('methodProti');

export type Class = any;
export type DecoratorOpts = {
    [k: string]: any;
};

export type METHODDATA = {
    path: string;
    opts: DecoratorOpts;
    method: string;
    fnName: string;
    value: Function;
};

export type METHODDATAS = METHODDATA[] | undefined;