import {
    formatURL,
    type ClientContext,
    type ClientOptions,
    isValidURL,
    BasePluginType,
    Subscriber,
    SDK_APP_ID,
} from '@timotte-sdk/utils';

export abstract class Core<O extends ClientOptions> {
    private readonly _options: O;

    public context: ClientContext;
    protected appId: string;
    protected readonly dataQueue: Array<any>;
    protected isReady: boolean = false;

    constructor(options: O) {
        // 判断插件环境
        if (!this.isInRightEnv()) {
            console.error('The current environment does not match the client configuration!');
            return;
        }
        this.dataQueue = [];
        this._options = options;
        // 处理上下文
        this.transOptions();
        // 初始化app
        this.initApp().then((id) => {
            localStorage.setItem(SDK_APP_ID, id);
            // 处理应用id
            this.appId = id;
            // // 开始执行上报
            this.isReady = true;
            // // 上报之前存起来的数据
            this.executeUploadData();
        });
    }

    use(plugins: BasePluginType[]) {
        const { enabled, uploadUrl } = this.context;
        // 统管插件的事件总线
        const subscriber = new Subscriber();
        for (const plugin of plugins) {
            // 绑定pluginName传入插件的monitor
            plugin.monitor.call(this, subscriber.notify.bind(subscriber, plugin.name));

            /**
             * 此处callback会拿到上报的数据，先后经过插件、各个端的transform
             * 然后经由nextTick异步调度执行上报逻辑
             * @param args
             * @returns
             */
            const callback = (...args: any[]) => {
                // 插件自定义数据
                const pluginDatas = plugin.transform.apply(this, args);
                // 客户端自定义数据
                const clientDatas = this.transform(pluginDatas);
                if (!clientDatas) return;
                if (!enabled) return;
                if (!this.isReady) {
                    this.dataQueue.push(clientDatas);
                }
                // 利用nextTick上报数据
                this.nextTick(this.report, this, uploadUrl, { appId: this.appId, ...clientDatas });
            };

            subscriber.add(plugin.name, callback);
        }
    }

    /**
     * 处理未准备好时存起来的所有数据
     * @returns
     */
    executeUploadData() {
        if (this.isReady && this.isInRightEnv) {
            while (this.dataQueue.length) {
                const data = this.dataQueue.shift();
                return this.nextTick(this.report, this, { appId: this.appId, ...data });
            }
        }
    }

    get options() {
        return this._options;
    }

    /** 是否在正确的环境 */
    abstract isInRightEnv(): boolean;

    /** 初始化app信息 */
    abstract initApp(): Promise<string>;

    abstract transform(data: any): any;

    /**
     * 上报方式
     * @param {string} url - 接口地址
     * @param {} type - 请求方式（枚举类型，各端有差异）
     * @param {IAnyObject} datas - 上传数据
     */
    abstract report(url: string, datas: any, type?: any): void;

    /**
     * 异步上报管理器
     */
    abstract nextTick(cb: Function, ctx: Object, ...args: any[]): void;

    private transOptions() {
        const { dsn, app, debug = false, enabled = true } = this.options;
        if (!app || !dsn) {
            console.log('Missing app or dsn config!');
            return;
        }

        const { host, init, upload = '', fallbackUrl } = dsn;
        if (!isValidURL(fallbackUrl)) {
            console.log('Fallback Url is not a valid url path!');
            return;
        }
        const initUrl = formatURL(host, init, fallbackUrl);
        const uploadUrl = formatURL(host, upload, fallbackUrl);

        // 插件上下文
        this.context = {
            app,
            uploadUrl,
            initUrl,
            debug,
            enabled,
        };
    }
}
