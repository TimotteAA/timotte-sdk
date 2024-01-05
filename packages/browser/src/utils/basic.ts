import { formatDecimal } from '@timotte-sdk/utils';

export interface BasicMetric {
    dnsSearchTime: number; // dns解析时间
    tcpConnectTime: number; // tcp建立连接所用时间
    sslConnectTime: number; // ssl建立连接所用时间
    firstRequest: number; // TTFB 首字节网络请求耗时
    firstResponse: number; // 同上
    domTreeTime: number; // dom树构建所用时间
    resourceLoadTime: number; // 资源加载耗时
    domReadyTime: number; // dom ready
    httpHead: number; // http首部大小
    interactiveTime: number; // 首次可交互时间
    completeTime: number; // 完全加载时间
    redirectTime: number; // 重定向时间
    redirectCount: number; // 重定向次数
    duration: number; // 全部资源加载耗时;
    fp: number; // 白屏时间，任意像素点出现时间
    fcp: number; // 首屏时间
}

const getBasicMetric = (): BasicMetric => {
    const {
        domainLookupStart,
        domainLookupEnd,
        // tcp
        connectStart,
        connectEnd,
        // ssl
        secureConnectionStart,
        loadEventStart,
        domInteractive,
        domContentLoadedEventEnd,
        duration,
        responseStart,
        responseEnd,
        fetchStart,
        transferSize,
        encodedBodySize,
        // 重定向
        redirectStart,
        redirectEnd,
        redirectCount,
    } = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const { startTime: fp } =
        performance.getEntriesByType('paint').find(({ name }) => name === 'first-paint') || {};
    const { startTime: fcp } =
        performance
            .getEntriesByType('paint')
            .find(({ name }) => name === 'first-contentful-paint') || {};
    return {
        fp: formatDecimal(fp, 3),
        fcp: formatDecimal(fcp, 3),
        dnsSearchTime: formatDecimal(domainLookupEnd - domainLookupStart, 3),
        tcpConnectTime: formatDecimal(connectEnd - connectStart, 3),
        sslConnectTime: formatDecimal(connectEnd - secureConnectionStart, 3),
        firstRequest: formatDecimal(responseStart - redirectStart, 3),
        firstResponse: formatDecimal(responseEnd - redirectStart, 3),
        domTreeTime: formatDecimal(domInteractive - responseEnd, 3),
        resourceLoadTime: formatDecimal(loadEventStart - domContentLoadedEventEnd, 3),
        domReadyTime: formatDecimal(domContentLoadedEventEnd - fetchStart, 3),
        interactiveTime: formatDecimal(domInteractive - fetchStart, 3),
        completeTime: formatDecimal(loadEventStart - fetchStart, 3),
        httpHead: formatDecimal(transferSize - encodedBodySize, 3),
        redirectCount: formatDecimal(redirectCount, 3),
        redirectTime: formatDecimal(redirectEnd - redirectStart, 3),
        duration: formatDecimal(duration, 3),
    };
};

export { getBasicMetric };
