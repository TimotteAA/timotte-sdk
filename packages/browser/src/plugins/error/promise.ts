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

type PromiseErrorPluginNotifyData = {
    eventType: EventTypes.PROMISE_ERROR;
    data: PromiseRejectionEvent;
};

type PromiseErrorTransformData = {
    eventType: EventTypes.PROMISE_ERROR;
    data: {
        message: string;
    };
};

class PromiseErrorPlugin implements BasePluginType {
    name = 'promiseErrorPlugin';
    monitor(notify: (data: PromiseErrorPluginNotifyData) => void) {
        window.addEventListener('unhandledrejection', (e) => {
            e.preventDefault();
            notify({
                eventType: EventTypes.PROMISE_ERROR,
                data: e,
            });
        });
    }

    transform(notifyData: PromiseErrorPluginNotifyData): ReportData<PromiseErrorTransformData> {
        console.log('transform');
        // return 'hahaha';
        const id = generateUUid();
        const time = getTime().format('YYYY-DD-MM HH:mm:ss');
        const { data } = notifyData;

        let message: string;
        if (typeof data.reason === 'string') {
            message = data.reason;
        } else if (typeof data.reason === 'object' && data.reason.stack) {
            message = data.reason.stack;
        }
        // 添加到用户行为队列中
        const self = this as unknown as BrowserClient;
        self.breadcrumb.push({
            type: BrowserBreadcrumbTypes.UNHANDLEDREJECTION,
            level: BreadcrumbLevel.ERROR,
            message,
        });
        const breadcrumb = self.breadcrumb.queue;
        return {
            id,
            breadcrumb,
            time,
            type: EventTypes.PROMISE_ERROR,
            data: {
                eventType: EventTypes.PROMISE_ERROR,
                data: {
                    message,
                },
            },
        };
    }
}

export const promiseErrorPlugin = () => new PromiseErrorPlugin();
