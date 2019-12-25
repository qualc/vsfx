import Applicetion from './application';
interface APP extends Applicetion {}

class App extends Applicetion {
    constructor() {
        super();
    }
}

const app = new App();
export const use = app.use.bind(app);
export const statics = app.static.bind(app);
export const useIntercept = app.useIntercept.bind(app);
export default function server(): APP {
    return app;
}
