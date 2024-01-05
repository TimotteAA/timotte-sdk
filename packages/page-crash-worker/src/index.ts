import { PageCrashMessage } from '@timotte-sdk/browser';
import {
    BreadcrumbData,
    BreadcrumbLevel,
    BrowserBreadcrumbTypes,
    EventTypes,
    generateUUid,
    getTime,
    post,
} from '@timotte-sdk/utils';

export interface PageCrashWorkerOptions {
    /**
     * 多久未收到心跳检测，视为应用已经炸了
     */
    crashThreshold: number;
    /**
     * 定时检测的周期
     */
    checkDuration: number;
}

export class PageCrashWorker {
    private apps: Record<
        string,
        {
            lastTime: number;
            info: PageCrashMessage['data'];
        }
    > = {};
    private timer: any = null;

    constructor(private options: PageCrashWorkerOptions) {
        console.log('page crash worker start to run');
        this.init();
    }

    init() {
        const self = this;
        onmessage = (e) => {
            const message = e.data as PageCrashMessage;

            const { id: appId } = message;
            const { type } = message;
            if (type === 'heartbeat') {
                // 记录下时间
                self.apps[appId] = {
                    lastTime: Date.now(),
                    info: message.data,
                };
                if (!self.timer) {
                    // 定期检查
                    self.timer = setInterval(() => self.checkCrash(), self.options.checkDuration);
                }
            } else if (type === 'unload') {
                delete self.apps[appId];
            }
        };
    }

    checkCrash() {
        console.log('check');
        for (const appId of Object.keys(this.apps)) {
            const { lastTime, info } = this.apps[appId];
            const now = Date.now();
            const { lastOperate } = info;
            const {
                message: { sendUrl, clientInfo },
            } = info;
            // 心跳检测时间差超过了设定阈值
            if (now - lastTime >= this.options.crashThreshold) {
                const breadcrumbData: BreadcrumbData = {
                    type: BrowserBreadcrumbTypes.CRASH,
                    level: BreadcrumbLevel.FATAL,
                    event: 'page crash',
                    message: `App of appId: ${appId} crash!`,
                    time: getTime().format('YYYY-MM-DD HH-mm-ss'),
                };
                post(sendUrl, {
                    id: generateUUid(),
                    time: getTime().format('YYYY-MM-DD HH-mm-ss'),
                    type: EventTypes.PAGE_CRASH,
                    data: {
                        ...clientInfo,
                        operate: [lastOperate, breadcrumbData],
                    },
                });
                delete this.apps[appId];
            } else {
                console.log('still alive!');
            }
        }
        if (Object.keys(this.apps).length === 0 && this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// 把umd丢到项目的public下，可以运行用以简单的测试
const crashDetectCenter = new PageCrashWorker({ checkDuration: 1000, crashThreshold: 2000 });
crashDetectCenter.init();
