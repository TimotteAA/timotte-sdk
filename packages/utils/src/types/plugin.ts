import { ReportData } from './core';

/**
 * 单个插件
 */
export interface BasePluginType<CollectData = any> {
    /** 插件名称 */
    name: string;
    /** 插件核心逻辑
     * 比如监听error事件
     * 入参notify方法，第一个参数已经绑定了插件的名称
     * 插件自身只需要关注需要上报的数据，而具体的上报将由各个端自己去实现
     */
    monitor: (notify: (data: CollectData) => void) => void;
    // 处理插件数据的转换
    transform?: (data: CollectData) => ReportData<any>;
    // 其余方法
    [key: string]: any;
}
