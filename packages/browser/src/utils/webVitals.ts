import { onLCP, onFID, onCLS } from "web-vitals"

export interface WebVitals {
    /**
     * 首次内容绘制时间
     */
    fcp: number;
    /**
     * 首次点击交互时间
     */
    fid: number;
    /**
     * 视觉稳定性
     */
    cls: number;
}

// 最大内容绘制
function fetchFCP(): Promise<number> {
    return new Promise(resolve => {
        onLCP((metric) => resolve(metric.value))
    })
}

// 首次点击交互时间
function fetchFid(): Promise<number> {
    return new Promise(resolve => {
        onFID(metric => resolve(metric.value))
    })
}

// 视觉稳定性
function fetchCLS(): Promise<number> {
    return new Promise(resolve => onCLS(metric => resolve(metric.value)))
}

const getWebVitals = (): Promise<WebVitals> => {
    return new Promise(resolve => {
        Promise.all([fetchFCP(), fetchFid(), fetchCLS()]).then(([fcp, fid, cls]) => resolve({fcp, fid, cls}))
    }) 
}

export {
    getWebVitals
}