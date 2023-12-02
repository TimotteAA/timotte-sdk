import { UnknownFunc } from './types/utils';

/**
 * 统管各个插件的事件总线
 */
export class Subscriber {
    private map: Map<string, Array<UnknownFunc>> = new Map();

    /**
     * 添加一个插件的监听回调
     * @param pluginName 插件名称
     * @param callback 回调函数
     */
    add(pluginName: string, callback: UnknownFunc) {
        if (!this.map.has(pluginName)) {
            this.map.set(pluginName, [callback]);
        } else {
            this.map.set(pluginName, this.map.get(pluginName).concat(callback));
        }
    }

    /**
     * 执行插件对应的回调函数
     * @param pluginName
     * @param notify
     * @returns
     */
    notify(pluginName: string, data: any) {
        if (!this.map.has(pluginName)) return;
        const fns = this.map.get(pluginName);
        if (Array.isArray(fns) && fns.length) {
            fns.forEach(fn => {
                fn(data)
            })
        }
    }
}
