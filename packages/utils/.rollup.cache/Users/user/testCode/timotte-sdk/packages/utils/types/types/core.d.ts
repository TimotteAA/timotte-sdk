import { EventTypes } from '../constants/core';
import { BreadcrumbData } from './breadcrumb';
import { BasePluginType } from './plugin';
export interface Dsn {
    host: string;
    init: string;
    upload: string;
    fallbackUrl: string;
}
export interface AppInfo {
    name: string;
    leader: string;
    desc?: string;
}
export interface ReportData<T extends any> {
    id: string;
    time: string;
    type: EventTypes;
    data: T;
    breadcrumb?: BreadcrumbData[];
}
export interface ClientOptions {
    dsn: Dsn;
    app: AppInfo;
    debug?: boolean;
    enabled?: boolean;
    plugins?: BasePluginType[];
    maxBreadcrumbs: number;
}
