import { formatDecimal } from '@timotte-sdk/utils';

export type ResourceData = Array<{ name: string; time: number }>;

export const getResources = (): ResourceData => {
    return performance.getEntriesByType('resource').map((item: PerformanceResourceTiming) => ({
        name: item.name,
        time: formatDecimal(item.responseEnd, 3),
    }));
};
