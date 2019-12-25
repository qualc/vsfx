import Applicetion from './application';
interface APP extends Applicetion {
}
export declare const use: (...args: any[]) => void;
export declare const statics: (filePath: string) => void;
export declare const useIntercept: (path: string | Function, handle?: Function | undefined) => void;
export default function server(): APP;
export {};
