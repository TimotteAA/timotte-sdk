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
     * 初始沟通一下server
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

    nextTick(cb: Function, ctx: Object, ...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    async get(url: string, datas: any) {
        return { id: '' };
    }
}
