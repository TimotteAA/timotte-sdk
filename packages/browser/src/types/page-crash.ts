import { BreadcrumbData, ClientInfo } from '@timotte-sdk/utils';

export interface PageCrashMessage {
    type: 'heartbeat' | 'unload';
    id: string;
    data: {
        lastOperate: BreadcrumbData;
        message: {
            sendUrl: string;
            clientInfo: ClientInfo;
        };
    };
}
