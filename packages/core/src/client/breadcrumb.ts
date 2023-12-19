import { getTime, type BreadcrumbData, BreadcrumbLevel, ClientOptions } from '@timotte-sdk/utils';

export class BaseBreadcrumb<O extends ClientOptions> {
    private readonly maxBreadcrumbs: number = 5;
    private _queue: BreadcrumbData[] = [];

    constructor(private options: Partial<O> = {}) {}

    /**
     * 添加一个用户行为栈
     *
     * @param data {BreadcrumbData} data
     */
    push(data: BreadcrumbData): BreadcrumbData[] {
        if (!data.time) {
            data.time = getTime().format('YYYY-MM-DD HH:mm:ss');
        }
        if (!data.level) {
            data.level = BreadcrumbLevel.INFO;
        }
        if (this._queue.length >= this.maxBreadcrumbs) {
            this._queue.shift();
        }
        this._queue.push(data);
        return this._queue;
    }

    clear() {
        this._queue = [];
    }

    get queue() {
        return this._queue;
    }
}
