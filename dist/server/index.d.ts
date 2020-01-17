import Applicetion from './application';
interface APP extends Applicetion {
}
export declare const use: (...args: any[]) => void;
export declare const statics: (filePath: string) => void;
export declare const useIntercept: (path: TimerHandler, handle?: Function | undefined) => void;
export default function server(): APP;
export {};
