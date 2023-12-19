import { BaseBreadcrumb, Core } from '@timotte-sdk/core';
import { getTime } from '@timotte-sdk/utils';
import type { RecordAny, UnknownFunc } from '@timotte-sdk/utils';
import { v4 as uuidv4 } from 'uuid';

import { ReportDeployment, ReportType } from './constants';
import * as pluginMaps from './plugins';
import { BrowserClientOptions } from './types';
import { TaskQueue, get, post, sendBeacon, sendByImg } from './utils';
import { nextTick } from './utils/nextTick';

/**
 * 浏览器端sdk
 */
export class BrowserClient extends Core<BrowserClientOptions> {
    private sessionId: string;
    private reportType: ReportType;
    private reportDeployment: ReportDeployment;
    private taskQueue = new TaskQueue(5);
    public breadcrumb: BaseBreadcrumb<BrowserClientOptions>;

    constructor(options: BrowserClientOptions) {
        super(options);
        this.sessionId = uuidv4();
        this.reportType = options.reportType ?? ReportType.Beacon;
        this.reportDeployment = options.reportDeployment ?? ReportDeployment.TICK;
        this.breadcrumb = new BaseBreadcrumb(options);
    }

    isInRightEnv(): boolean {
        return 'window' in global;
    }

    /**
     * 初始沟通一下server，我好啦
     */
    async initApp(): Promise<string> {
        const { app, initUrl } = this.context;
        const time = getTime();
        const data = {
            ...app,
            time,
            // sessionId
            sessionId: this.sessionId,
        };
        const { id } = (await post(initUrl, data)) as any;
        return id;
    }

    /**
     * 给插件数据加上额外的浏览器信息
     * @param data
     * @returns
     */
    transform(data: any) {
        const browserData = {
            // 语言
            language: navigator.language,
            // 访问设备
            userAgent: navigator.userAgent,
            // 时间
            time: getTime(),
            // 回话id
            sessionId: this.sessionId,
            // 项目标题
            title: document.title,
            // 所处域名
            href: window.location.href,
            ...data,
        };
        return browserData;
    }

    // 上报方式
    // 1. sendBeacon
    // 2. img Send
    // 3. xhr post or get

    report(url: string, datas: RecordAny) {
        switch (this.reportType) {
            case ReportType.Beacon: {
                return sendBeacon(url, datas);
            }
            case ReportType.GET: {
                return get(url, datas);
            }
            case ReportType.POST: {
                return post(url, datas);
            }
            default: {
                return sendByImg(url, datas);
            }
        }
    }

    /**
     *
     * @param cb 其实是this.report
     * @param ctx 插件实例
     * @param args 包含上传url，上报数据
     */
    nextTick(cb: UnknownFunc, ctx: RecordAny, ...args: any[]): void {
        const [url, clientData] = args;

        switch (this.reportDeployment) {
            case ReportDeployment.TICK: {
                nextTick(() => cb.call(ctx, url, clientData));
                return;
            }
            case ReportDeployment.QUEUE: {
                this.taskQueue.addTask(() => cb.call(ctx, url, clientData));
                return;
            }
        }
    }
}

// 性能收集：fp、lcp、fcp、onload
// 资源加载时间、接口时间

// js错误、xhr类似的异步错误

// 用户行为：pv、uv

const createBrowserClient = (options: BrowserClientOptions) => {
    const client = new BrowserClient(options);
    const plugins = Array.from(Object.values(pluginMaps)).map((Plugin) => new Plugin());
    client.use(plugins);
    return client;
};
export default createBrowserClient;
export * from './plugins';
