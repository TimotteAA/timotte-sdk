import { BreadcrumbLevel, BrowserBreadcrumbTypes } from '../constants';

/**
 * 用户行为栈类型
 * 当前仅支持浏览器中的操作
 */
export type BreadcrumbTypes = BrowserBreadcrumbTypes;
export interface BreadcrumbData {
    event: string;
    type: BreadcrumbTypes;
    message: string;
    level?: BreadcrumbLevel;
    time?: string;
}