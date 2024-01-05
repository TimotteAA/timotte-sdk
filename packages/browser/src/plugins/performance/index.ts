import { BasePluginType, EventTypes, ReportData } from '@timotte-sdk/utils';
import {
    PerformancePluginOptions,
    PerformaceMetric,
    BasicPerformanceNotifyData,
    FpsPerformanceNotifyData,
    ResourcesPerformanceNotifyData,
    VitalsPerformanceNotifyData,
} from '../../types';
import { getTime, generateUUid } from '@timotte-sdk/utils';
import { getBasicMetric, getWebVitals, FpsTool, getResources } from '../../utils';

type CollectedData =
    | BasicPerformanceNotifyData
    | FpsPerformanceNotifyData
    | ResourcesPerformanceNotifyData
    | VitalsPerformanceNotifyData;

function performancePlugin(options: PerformancePluginOptions = {}): BasePluginType {
    // 禁用标识
    const { off = [] } = options;
    return {
        name: 'perPlugin',
        monitor(notify: (data: CollectedData) => void) {
            const fpsTool = new FpsTool();
            // vitals
            if (!off.includes(PerformaceMetric.VITALS)) {
                getWebVitals().then((vitals) => {
                    notify({
                        subType: PerformaceMetric.VITALS,
                        data: vitals,
                    });
                });
            }
            window.addEventListener(
                'load',
                () => {
                    // 基础参数
                    if (!off.includes(PerformaceMetric.BASIC)) {
                        notify({
                            subType: PerformaceMetric.BASIC,
                            data: getBasicMetric(),
                        });
                    }
                    // 资源耗时
                    if (!off.includes(PerformaceMetric.RESOURCE)) {
                        notify({
                            subType: PerformaceMetric.RESOURCE,
                            data: getResources(),
                        });
                    }
                    // fps
                    if (!off.includes(PerformaceMetric.FPS)) {
                        fpsTool.run();
                        setTimeout(() => {
                            notify({
                                subType: PerformaceMetric.FPS,
                                data: fpsTool.get(),
                            });
                            // 上报后销毁监听
                            fpsTool.destroy();
                        }, 500);
                    }
                },
                true,
            );
        },
        transform(collectedData: CollectedData): ReportData<CollectedData> {
            return {
                id: generateUUid(),
                time: getTime().format('YYYY-MM-DD'),
                type: EventTypes.PERFORMANCE,
                data: {
                    ...collectedData,
                },
            };
        },
    };
}

export { performancePlugin };
