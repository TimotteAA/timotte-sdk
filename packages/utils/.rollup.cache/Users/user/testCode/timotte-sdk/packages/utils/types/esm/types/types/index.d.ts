import { AppInfo } from './core';
export * from './time';
export * from './breadcrumb';
export * from './plugin';
export * from './core';
export interface ClientContext {
    app: AppInfo;
    uploadUrl: string;
    initUrl: string;
    debug: boolean;
    enabled?: boolean;
}
