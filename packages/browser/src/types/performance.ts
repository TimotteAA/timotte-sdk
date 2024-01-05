import { BasicMetric, ResourceData, WebVitals } from '../utils';

export enum PerformaceMetric {
    BASIC = 'basic',
    RESOURCE = 'resource',
    FPS = 'fps',
    VITALS = 'vitals',
}

export interface PerformancePluginOptions {
    /**
     * 不监听的指标
     */
    off?: PerformaceMetric[];
}

export interface BasePerformanceNotifyData<T extends any> {
    eventType: string;
    data: T;
}

export type BasicPerformanceNotifyData = BasePerformanceNotifyData<BasicMetric>;
export type FpsPerformanceNotifyData = BasePerformanceNotifyData<number>;
export type ResourcesPerformanceNotifyData = BasePerformanceNotifyData<ResourceData>;
export type VitalsPerformanceNotifyData = BasePerformanceNotifyData<WebVitals>;
