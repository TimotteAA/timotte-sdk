import {
    BasePluginType,
    BreadcrumbLevel,
    BrowserBreadcrumbTypes,
    EventTypes,
    ReportData,
    generateUUid,
    getTime,
} from '@timotte-sdk/utils';

import { BrowserClient } from '../..';
import { BrowserErrorTypes } from '../../constants/error';

type ResoureceEventData = {
    /**
     * 上报事件分类
     */
    eventType: EventTypes;
    /**
     * 监听到时间的数据
     */
    data: Event;
};

type ResourceTarget = {
    localName: string;
    src: string;
    href: string;
};

type ResourceTypeError = {
    eventType: BrowserErrorTypes;
    resourceType: string;
    href: string;
};

type JSCodeError = {
    eventType: BrowserErrorTypes;
    detail: {
        lineno: number;
        message: string;
    };
};

class MonitorResourceErrorPlugin implements BasePluginType {
    name = 'monitorResourceErrorPlugin';
    monitor(notify: (data: ResoureceEventData) => void) {
        window.addEventListener('error', (e) => {
            e.preventDefault();
            notify({
                eventType: EventTypes.ERROR,
                data: e,
            });
        });
    }
    transform(eventData: ResoureceEventData): ReportData<ResourceTypeError | JSCodeError> {
        const id = generateUUid();
        const time = getTime().format('YYYY-DD-MM HH:mm:ss');
        const { data, eventType } = eventData;

        const { localName, src, href } = (data.target as unknown as ResourceTarget) || {};
        if (localName) {
            // 资源加载错误
            const resourceData = {
                // html标签
                resourceType: localName,
                href: src || href,
            };
            // 添加行为栈
            const self = this as unknown as BrowserClient;
            self.breadcrumb.push({
                type: BrowserBreadcrumbTypes.RESOURCE,
                level: BreadcrumbLevel.ERROR,
                message: `Unable to load "${resourceData.resourceType}"`,
            });
            const breadcrumb = self.breadcrumb.queue;
            return {
                id,
                breadcrumb,
                time,
                type: eventType,
                data: {
                    eventType: BrowserErrorTypes.RESOURCEERROR,
                    ...resourceData,
                } as ResourceTypeError,
            };
        }

        // js脚本错误
        const { message, lineno, colno, filename } = data as ErrorEvent;
        const resourceData = {
            filename,
            detail: {
                lineno,
                colno,
                message,
            },
        };
        // 添加行为栈
        const self = this as unknown as BrowserClient;
        self.breadcrumb.push({
            type: BrowserBreadcrumbTypes.CODE_ERROR,
            level: BreadcrumbLevel.ERROR,
            message,
        });
        const breadcrumb = self.breadcrumb.queue;
        return {
            id,
            time,
            type: eventType,
            breadcrumb,
            data: {
                eventType: BrowserErrorTypes.CODEERROR,
                ...resourceData,
            } as JSCodeError,
        };
    }
}

export const monitorResourceErrorPlugin = () => new MonitorResourceErrorPlugin();
