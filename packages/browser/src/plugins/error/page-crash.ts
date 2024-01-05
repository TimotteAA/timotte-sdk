import { BasePluginType, ClientInfo, generateUUid } from '@timotte-sdk/utils';
import { BrowserClient } from '../../..';
import { PageCrashMessage } from '../../types/page-crash';

export interface PageCrashPluginOptions {
    heartbeatInterval: number;
    crashDetectWorkerUrl: string;
}

// class PageCrashPlugin implements BasePluginType

export const pageCrashPlugin = (options: PageCrashPluginOptions): BasePluginType => {
    const { heartbeatInterval, crashDetectWorkerUrl } = options;
    return {
        name: 'pageCrashPlugin',
        monitor() {
            // 应用id
            const appId = localStorage.getItem('__sdk_app_id');
            const sessionId = localStorage.getItem('__sdk_session_id');
            const { userAgent, language } = navigator;
            const { href } = location;
            const { title } = document;
            const clientInfo: ClientInfo = {
                appId,
                sessionId,
                userAgent,
                language,
                pagePath: href,
                pageTitle: title,
                platform: userAgent,
            };
            const { uploadUrl } = (this as any).context;
            // send to worker
            const message = {
                sendUrl: uploadUrl,
                clientInfo,
            };

            const crashDetectCenter = new Worker(crashDetectWorkerUrl, {
                type: 'module',
            });
            const workerSessionId = generateUUid();
            const heartbeat = () => {
                // 发送心跳前的最后一次用户操作
                const lastOperate = (this as unknown as BrowserClient).breadcrumb.queue.shift();
                const data: PageCrashMessage = {
                    // 定期ping一下
                    type: 'heartbeat',
                    id: workerSessionId,
                    data: {
                        lastOperate,
                        message,
                    },
                };
                crashDetectCenter.postMessage(data);
                console.log('heartbeat ');
            };
            window.addEventListener('beforeunload', () => {
                // 发送心跳前的最后一次用户操作
                const lastOperate = (this as any).breadcrumb.queue().shift();
                const data: PageCrashMessage = {
                    // 定期ping一下
                    type: 'heartbeat',
                    id: appId,
                    data: {
                        lastOperate,
                        message,
                    },
                };
                crashDetectCenter.postMessage(data);
            });
            setInterval(heartbeat, heartbeatInterval);
            heartbeat();
        },
    };
};
