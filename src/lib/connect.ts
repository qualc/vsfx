import { NextFunction } from '../index.d';
import * as fs from 'fs';
import * as path from 'path';
import { use } from '../server';

import { METHOD_METADATA, CONTROLLER_METADATA } from '../global';

// Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'

// mapRoute(new SomeClass());
export const DefineRoute = (baseUrl: string | string[], controllersPath?: string | string[]) => {
    if (baseUrl && !controllersPath) {
        controllersPath = baseUrl;
        baseUrl = '/';
    }
    try {
        if (controllersPath && !Array.isArray(controllersPath)) {
            controllersPath = [controllersPath];
        }
        const classs: [any?] = [];
        if (controllersPath && Array.isArray(controllersPath)) {
            // 遍历挂载 controller
            controllersPath.forEach(cpaths => {
                classs.push(...__explorer(cpaths));
            });
        }
        _defineMetadata(baseUrl.toString(), classs);
    } catch (e) {
        console.log(`有路由挂载失败啦:~err:${e.stack}`);
    }
};

function _defineMetadata(baseUrl: string, classs: [any?]) {
    classs.forEach(classItem => {
        Object.keys(classItem).map(key => {
            const item = classItem[key];
            const controllerPath = _validatePath(baseUrl + Reflect.getMetadata(CONTROLLER_METADATA, item));
            mapRoute(new item(), controllerPath);
        });
    });
}

function mapRoute(instance: Object, baseUrl) {
    const prototype = Object.getPrototypeOf(instance);

    // // 筛选出类的 methodName
    const methodsNames = Object.getOwnPropertyNames(prototype).filter(item => item !== 'constructor' && typeof prototype[item] === 'function');
    return methodsNames.map(methodName => {
        const handle = prototype[methodName];

        // 取出定义的 metadata
        let path = Reflect.getMetadata(CONTROLLER_METADATA, handle);
        const method = Reflect.getMetadata(METHOD_METADATA, handle);
        path = baseUrl + _validatePath(path);
        path = path.replace(/(\w+)\/$/, '');
        use(method, path, function(req: any, res: any, next: NextFunction) {
            handle.call(instance, req, res, next);
        });
        use(method, path, handle.bind(instance));
        // return {
        //     path,
        //     method,
        //     handle,
        //     methodName
        // };
    });
}

function _validatePath(path: string) {
    if (!path) return '/';
    path = path.replace(/^(\/*)/, '/');
    return path;
}

// 递归加载 controller， 使其注入到 Reflect 中
function __explorer(cpaths: string): [any?] {
    const classs: [any?] = [];
    try {
        let files = fs.readdirSync(cpaths);
        files.forEach(function(file) {
            let _path = path.join(cpaths, file);
            try {
                let statInfo = fs.statSync(_path);
                if (statInfo.isDirectory()) {
                    classs.push(...__explorer(_path));
                } else {
                    if (/\.[jt]s$/.test(path.parse(_path).ext)) {
                        classs.push(require(_path));
                    }
                }
            } catch (e) {
                throw e;
            }
        });
    } catch (e) {
        console.log(`connect获取文件失败啦~err:${e.message}`);
    }
    return classs;
}
