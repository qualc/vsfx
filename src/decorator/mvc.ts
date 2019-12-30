import 'reflect-metadata';
import depd from 'depd';
import { METHOD_METADATA, CONTROLLER_METADATA, SERVICE_METADATA, SERVICE_OBJ } from '../global';

const deprecate = depd('vsfx');

export const Interceptors = (isInterceptors: Boolean = true): ClassDecorator => {
    deprecate(`Modifiers '@interceptors()' are obsolete and will not work`);
    return target => {
        const value = Reflect.getMetadata(CONTROLLER_METADATA, target) || {};
        if (!value.opts) {
            value.opts = {};
        }
        // value.opts.interceptors = isInterceptors;
        Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
    };
};
export const Controller = (path: string, opts: object = {}): ClassDecorator => {
    return target => {
        const value = Reflect.getMetadata(CONTROLLER_METADATA, target) || {};
        value.path = path;
        if (!value.opts) {
            value.opts = {};
        }
        value.opts = Object.assign(value.opts, opts);
        Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
    };
};
export const Service = (serviceName?: string): ClassDecorator => {
    deprecate(`Considering whether to implement decorator '@Service'`);
    return target => {
        if (!serviceName) {
            Reflect.defineMetadata(SERVICE_METADATA, target, SERVICE_OBJ, target.name);
        } else {
            const serviceTarget = Reflect.getMetadata(SERVICE_METADATA, SERVICE_OBJ, serviceName);
            const value = {
                _type: 'proto'
            };
            Reflect.defineMetadata(CONTROLLER_METADATA, value, serviceTarget);
            target.prototype[serviceName] = new serviceTarget();
        }
    };
};
const createMethodsDecorator = (method: string, opts: object = {}) => (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
        const value = {
            path,
            opts,
            _type: 'method'
        };
        Reflect.defineMetadata(CONTROLLER_METADATA, value, <any>descriptor.value);
        Reflect.defineMetadata(METHOD_METADATA, method, <any>descriptor.value);
    };
};

export const Get = createMethodsDecorator('get');
export const Post = createMethodsDecorator('post');

export default {
    Controller,
    Service,
    Get,
    Post,
    Interceptors
};
