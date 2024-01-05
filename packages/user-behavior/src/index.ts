import { BrowserClient } from '@timotte-sdk/browser';
import {
    BasePluginType,
    BreadcrumbData,
    BrowserBreadcrumbTypes,
    EventTypes,
    StoreType,
    generateUUid,
    getStore,
    getTime,
} from '@timotte-sdk/utils';

export interface UserBehavior {
    name: string;
    position: StoreType;
}

export interface UserBehaviorPluginOptions {
    targetBehaviors?: UserBehavior[];
    eventType: EventTypes.USER_BEHAVIOR;
}

export type UserBehaviorNotifyData = Record<string, any>;

const userBehaviorPlugin = (options: UserBehaviorPluginOptions): BasePluginType => {
    const { targetBehaviors } = options;
    return {
        name: 'userBehaviorPlugin',
        monitor(notify: (data: UserBehaviorNotifyData) => void) {
            // 在window上挂载手动上报方法，配合babel插件自动埋点上报
            (window as any)['TIMOTTE_SDK_REPORT'] = (eventType: string, data: any) => {
                notify({
                    eventType,
                    data,
                });
            };

            if (!Array.isArray(targetBehaviors) || !targetBehaviors.length) {
                return;
            }
            const userData: Record<string, any> = {};
            window.addEventListener('load', () => {
                for (const targetBehavior of targetBehaviors) {
                    const { name, position } = targetBehavior;

                    userData[name] = getStore(position, name);
                }
                notify({
                    eventType: EventTypes.USER_BEHAVIOR,
                    data: userData,
                });
            });
        },
        transform(data: UserBehaviorNotifyData) {
            const id = generateUUid();
            const time = getTime().format('YYYY-MM-DD HH:mm:ss');
            const lastOperate: BreadcrumbData = {
                type: BrowserBreadcrumbTypes.BEHAVIOR,
                event: 'collect user information',
                message: 'collect user infomation',
            };
            const self = this as unknown as BrowserClient;
            self.breadcrumb.push(lastOperate);
            const breadcrumbs = self.breadcrumb.queue;

            return {
                id,
                time,
                type: EventTypes.USER_BEHAVIOR,
                data: {
                    breadcrumbs,
                    data,
                },
            };
        },
    };
};
