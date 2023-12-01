import { UnknownFunc } from './types/utils';
export declare class Subscriber {
    private map;
    add(pluginName: string, callback: UnknownFunc): void;
    notify(pluginName: string, notify: (data: any) => void): void;
}
