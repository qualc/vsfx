import 'reflect-metadata';

const Controller = {};

type DecoratorOpts = {
    [k: string]: any;
};
type Class = any;
function Col(path: string, opts?: DecoratorOpts): ClassDecorator {
    return (target: Class) => {
        const metadata = Reflect.getOwnMetadata('col', Controller) || [];
        metadata.push({
            path,
            target,
            opts
        });
        Reflect.defineMetadata('col', metadata, Controller);
    };
}

function Get(path: string, opts?: DecoratorOpts): MethodDecorator {
    return (target, proto, description) => {
        const metadata = Reflect.getOwnMetadata('methods', target.constructor) || [];
        metadata.push({
            path,
            opts,
            methods: 'get',
            value: description.value
        });
        Reflect.defineMetadata('methods', metadata, target.constructor);
    };
}
function Post(path: string, opts?: DecoratorOpts): MethodDecorator {
    return (target, proto, description) => {
        const metadata = Reflect.getOwnMetadata('methods', target.constructor) || [];
        metadata.push({
            path,
            opts,
            methods: 'post',
            value: description.value
        });
        Reflect.defineMetadata('methods', metadata, target.constructor);
    };
}

function Body(target: Object, propertyKey: string | symbol, parameterIndex: number) {}

@Col('/')
class Texts {
    @Get('/info')
    async getInfo(@Body body: any) {}
    @Post('/list')
    async getList() {}
}

@Col('/')
class Texts2 {
    @Get('/info')
    async getInfo(@Body body: any) {}
    @Post('/list')
    async getList() {}
}

let a = Reflect.getMetadata('col', Controller);
a.forEach((controller: Class) => {
    const router = Reflect.getOwnMetadata('methods', controller.target);
});
// let router = Reflect.getOwnMetadata("methods", a.target);
// console.log(router);
