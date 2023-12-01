import { ReportData } from './core';
export interface BasePluginType<CollectData = any> {
    name: string;
    monitor: (notify: (data: CollectData) => void) => void;
    transform: (data: CollectData) => ReportData<any>;
    [key: string]: any;
}
