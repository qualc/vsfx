import { NextFunction } from '../../vsfx';
import depd from 'depd';
import * as fs from 'fs';
import * as path from 'path';
import { use } from '../server';

const deprecate = depd('vsfx');

import { METHOD_METADATA, CONTROLLER_METADATA } from '../global';

// Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'

// mapRoute(new SomeClass());
export const defineRoute = (baseUrl: string | string[], controllersPath?: string | string[]) => {
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
                classs.push(...recursionFile(cpaths));
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
            const metadata = Reflect.getMetadata(CONTROLLER_METADATA, item);
            if (!metadata) return;
            const { path, opts = {} } = metadata;
            const controllerPath = _validatePath(baseUrl + path);
            mapRoute(new item(), controllerPath, opts);
        });
    });
}
let index = 0;
function mapRoute(instance: Object, baseUrl, baseOpts) {
    const prototype = Object.getPrototypeOf(instance);

    // // 筛选出类的 methodName
    const methodsNames = Object.getOwnPropertyNames(prototype).filter(item => item !== 'constructor' && typeof prototype[item] === 'function');
    return methodsNames.map(methodName => {
        const handle = prototype[methodName];

        // 取出定义的 metadata
        const metadata = Reflect.getMetadata(CONTROLLER_METADATA, handle);
        let { path, opts = {}, _type } = metadata || {};
        if (_type != 'method') return;
        const method = Reflect.getMetadata(METHOD_METADATA, handle);
        path = baseUrl + _validatePath(path);
        path = path.replace(/(\w+)\/$/, '');
        Object.assign(baseOpts, opts);
        use(method, path, (req: any, res: any, next: NextFunction) => {
            req.opts = Object.freeze(baseOpts);
            const { interceptStack } = req.app;
            if (interceptStack.length) {
                let cindex = 0;
                const next2 = (err?: Error) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.stack);
                        return;
                    }
                    if (cindex == interceptStack.length) {
                        Resolve();
                        return;
                    }
                    let match: any = null,
                        intercept = <any>{};
                    while (match !== true && cindex < interceptStack.length) {
                        intercept = interceptStack[cindex++];
                        if (!intercept) {
                            continue;
                        }
                        if (!method || (intercept.method !== 'all' && method !== intercept.method)) {
                            continue;
                        }
                        match = handleMatch(intercept, path);
                        if (match !== true) {
                            continue;
                        }
                    }
                    if (match && cindex <= interceptStack.length) {
                        intercept.handle(req, res, next2);
                    } else if (cindex >= interceptStack.length) {
                        Resolve();
                    }
                };
                next2();
                return;
            } else {
                Resolve();
            }
            function Resolve() {
                Promise.resolve(handle.call(instance, req, res, next)).catch(err => {
                    if (typeof req.app?.catchFn == 'function') {
                        req.app?.catchFn(err, req, res, next);
                    } else {
                        deprecate(err.stack);
                        res.sendStatus(500);
                    }
                });
            }
        });
        // use(method, path, handle.bind(instance));
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
export const recursionFile = (cpaths: string): [any?] => {
    const classs: [any?] = [];
    try {
        let files = fs.readdirSync(cpaths);
        files.forEach(function(file) {
            let _path = path.join(cpaths, file);
            try {
                let statInfo = fs.statSync(_path);
                if (statInfo.isDirectory()) {
                    classs.push(...recursionFile(_path));
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
        console.log(`connect获取文件失败啦~err:${e.stack}`);
    }
    return classs;
};

function handleMatch(route: any, path: string) {
    console.log(route, path);
    const { reg } = route;
    let match = (path && reg && reg.exec(path)) || false;
    if (!match) {
        return false;
    }
    let { keys, params } = route;
    for (let i = 1; i < match.length; i++) {
        const key = (keys[i - 1] || {}).name;
        // 如果 val 是字符串, 就 decodeURIComponent 一下
        let val = match[i];
        if (typeof val == 'string') {
            val = decodeURIComponent(val);
        }
        if (val !== undefined || !Object.hasOwnProperty.call(params, key)) {
            params[key] = val;
        }
    }
    route.params = params;
    return true;
}
