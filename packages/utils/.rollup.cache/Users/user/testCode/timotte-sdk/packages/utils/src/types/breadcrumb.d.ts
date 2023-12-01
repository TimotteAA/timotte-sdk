import { BreadcrumbLevel, BrowserBreadcrumbTypes } from '../constants';
export type BreadcrumbTypes = BrowserBreadcrumbTypes;
export interface BreadcrumbData {
    event: string;
    type: BreadcrumbTypes;
    message: string;
    level?: BreadcrumbLevel;
    time?: string;
}
