import 'reflect-metadata';
import path from 'path';
import fs from 'fs';
import server, { use, useIntercept } from './server';
import { DefineRoute } from './lib/connect';

import { Controller, Get, Post } from './decorator';

const cwd = process.cwd();
let vsfxJson = fs.readFileSync(path.join(cwd, 'vsfx.config.json')).toString();
if (vsfxJson) {
    try {
        vsfxJson = JSON.parse(vsfxJson);
        const controllerPath = vsfxJson['controller'];
        if (controllerPath) {
            if (Array.isArray(controllerPath)) {
                controllerPath.forEach(controller => {
                    if (typeof controller === 'string') {
                        DefineRoute(path.join(cwd, controller));
                    } else if (controller.path) {
                        const base = controller.base.toString() || '/';
                        DefineRoute(base, path.join(cwd, controller.path));
                    }
                });
            } else if (typeof controllerPath === 'string') {
                DefineRoute(path.join(cwd, controllerPath));
            }
        }
    } catch (err) {
        console.log('加载配置文件失败', err.stack);
    }
}

// export { Controller, Get, Post } from './decorator';

export { use, useIntercept, DefineRoute, Controller, Get, Post };
export default server;
