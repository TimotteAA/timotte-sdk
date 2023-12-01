import { EventTypes } from '../constants/core';
import { BreadcrumbData } from './breadcrumb';
import { BasePluginType } from './plugin';

export interface Dsn {
    /** 服务器域名 */
    host: string;
    /** app初始化url */
    init: string;
    /** 上报url */
    upload: string;
    /** init和upload配错后，兜底的url */
    fallbackUrl: string;
}

export interface AppInfo {
    /** 应用名称 */
    name: string;
    /** 对应负责人 */
    leader: string;
    /** 描述信息 */
    desc?: string;
}

export interface ReportData<T extends any> {
    /** 应用id */
    id: string;
    /** 上报时间 */
    time: string;
    /** 上报事件 */
    type: EventTypes;
    /** 上报数据 */
    data: T;
    /** 用户行为栈数据 */
    breadcrumb?: BreadcrumbData[];
}

export interface ClientOptions {
    dsn: Dsn;
    app: AppInfo;
    debug?: boolean;
    enabled?: boolean;
    plugins?: BasePluginType[];
    /** 最大用户操作栈 */
    maxBreadcrumbs: number;
}
