import 'reflect-metadata';
import { METHOD_METADATA, CONTROLLER_METADATA } from '../global';

export const Controller = (path: string): ClassDecorator => {
    return target => {
        Reflect.defineMetadata(CONTROLLER_METADATA, path, target);
    };
};

const createMethodsDecorator = (method: string) => (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(CONTROLLER_METADATA, path, <any>descriptor.value);
        Reflect.defineMetadata(METHOD_METADATA, method, <any>descriptor.value);
    };
};

export const Get = createMethodsDecorator('get');
export const Post = createMethodsDecorator('post');

export default {
    Controller,
    Get,
    Post
};
