export declare function assignMetadata<TParamtype = any, TArgs = any>(args: TArgs, paramtype: TParamtype, index: number, data?: ParamData): TArgs & {
    [x: string]: {
        index: number;
    };
};
export declare enum RouteParamtypes {
    REQUEST = 0,
    RESPONSE = 1,
    NEXT = 2,
    BODY = 3,
    QUERY = 4,
    PARAM = 5,
    HEADERS = 6,
    SESSION = 7,
    FILE = 8,
    FILES = 9,
    IP = 10
}
export interface RouteParamMetadata {
    index: number;
    data?: ParamData;
}
export declare type ParamData = object | string | number;
export declare const Res: (data?: string | number | object | undefined) => ParameterDecorator;
