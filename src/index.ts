import 'reflect-metadata';
import path from 'path';
import fs from 'fs';
import server, { use, useIntercept } from './server';
import { defineRoute, recursionFile } from './lib/connect';

import { Controller, Service, Get, Post, Interceptors } from './decorator';

const cwd = process.cwd();
let vsfxJson = fs.readFileSync(path.join(cwd, 'vsfx.config.json')).toString();
if (vsfxJson) {
    try {
        vsfxJson = JSON.parse(vsfxJson);
        const base = vsfxJson['base'] ? path.join(cwd, vsfxJson['base']) : cwd;
        const servicePath = vsfxJson['service'];
        if (servicePath) {
            if (Array.isArray(servicePath)) {
                servicePath.forEach(service => {
                    recursionFile(path.join(base, service));
                });
            } else if (typeof servicePath === 'string') {
                recursionFile(path.join(base, servicePath));
            }
        }
        const controllerPath = vsfxJson['controller'];
        if (controllerPath) {
            if (Array.isArray(controllerPath)) {
                controllerPath.forEach(controller => {
                    if (typeof controller === 'string') {
                        defineRoute(path.join(base, controller));
                    } else if (controller.path) {
                        const baseUrl = controller.base.toString() || '/';
                        defineRoute(baseUrl, path.join(base, controller.path));
                    }
                });
            } else if (typeof controllerPath === 'string') {
                defineRoute(path.join(base, controllerPath));
            }
        }
    } catch (err) {
        console.log('加载配置文件失败', err.stack);
    }
}

// export { Controller, Get, Post } from './decorator';

export { use, useIntercept, defineRoute, Controller, Service, Get, Post, Interceptors };
export default server;
