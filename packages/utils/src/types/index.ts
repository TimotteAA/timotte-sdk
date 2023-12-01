import { AppInfo } from './core';

export * from './time';
export * from './breadcrumb';
export * from './plugin';
export * from './core';

export interface ClientContext {
    /** 使用client的app信息 */
    app: AppInfo;
    /** 基于dsn得到的上报地址 */
    uploadUrl: string;
    /** 基于dsn得到的app初始化地址 */
    initUrl: string;
    /** 是否启用debug模式 */
    debug: boolean;
    enabled?: boolean;
}
