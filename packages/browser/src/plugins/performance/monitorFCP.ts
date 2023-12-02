import { BasePluginType, ReportData, generateUUid, getTime } from '@timotte-sdk/utils';
import { EventTypes } from '@timotte-sdk/utils/dist/esm/types/constants';

import { PerformanceEventData } from '../../types';

export class MonitorFCPPlugin implements BasePluginType {
    name = 'monitorFCPPlugin';
    monitor(notify: (data: PerformanceEventData) => void) {
        if (typeof PerformanceObserver === 'undefined') return;

        const callback: PerformanceObserverCallback = (entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.entryType === 'first-contentful-paint') {
                    observer.disconnect();
                }
                const json = entry.toJSON();
                delete json.duration;
                notify({
                    ...json,
                    subType: entry.entryType,
                    pageUrl: window.location.href,
                });
            }
        };

        const observer = new PerformanceObserver(callback);
        // 考虑缓存因素
        observer.observe({ buffered: true, type: 'resource' });
    }
    transform(eventData: PerformanceEventData) {
        const reportData: ReportData<PerformanceEventData> = {
            id: generateUUid(),
            data: eventData,
            time: getTime().format('YYYY-DD-MM HH:mm:ss'),
            type: EventTypes.PERFORMANCE,
        };
        return reportData;
    }
}
