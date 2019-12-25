import { METHOD_PROTI_METADATA } from '../global';
export function assignMetadata<TParamtype = any, TArgs = any>(args: TArgs, paramtype: TParamtype, index: number, data?: ParamData) {
    return {
        ...args,
        [`${paramtype}:${index}`]: {
            index
        }
    };
}
export enum RouteParamtypes {
    REQUEST,
    RESPONSE,
    NEXT,
    BODY,
    QUERY,
    PARAM,
    HEADERS,
    SESSION,
    FILE,
    FILES,
    IP
}
export interface RouteParamMetadata {
    index: number;
    data?: ParamData;
}

export type ParamData = object | string | number;
const createParamsDecorator = (paramtype: RouteParamtypes) => (data?: ParamData): ParameterDecorator => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const args = Reflect.getMetadata(METHOD_PROTI_METADATA, target.constructor, propertyKey) || {};
        Reflect.defineMetadata(METHOD_PROTI_METADATA, assignMetadata<RouteParamtypes, Record<number, RouteParamMetadata>>(args, paramtype, parameterIndex, data), target.constructor, propertyKey);
    };
};
export const Res = createParamsDecorator(RouteParamtypes.REQUEST);
