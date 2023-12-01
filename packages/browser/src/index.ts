import { Core } from '@timotte-sdk/core';
import { ClientOptions, getTime } from '@timotte-sdk/utils';
import { v4 as uuidv4 } from 'uuid';

export interface BrowserClientOptions extends ClientOptions {}

export class BrowserClient extends Core<ClientOptions> {
    private sessionId: string;

    constructor(options: BrowserClientOptions) {
        super(options);
        this.sessionId = uuidv4();
    }

    isInRightEnv(): boolean {
        return 'windon' in global;
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
        const { id } = await this.get(initUrl, data);
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

    report(url: string, datas: any, type?: any): void {
        return this.get(url, datas);
    }

    /**
     *
     * @param cb 其实是this.report
     * @param ctx 插件实例
     * @param args 包含上传url，上报数据
     */
    nextTick(cb: Function, ctx: Object, ...args: any[]): void {}

    async get(url: string, datas: any) {
        return { id: '' };
    }
}
