import { formatURL, isValidURL, Subscriber, } from '@timotte-sdk/utils';
export class Core {
    _options;
    context;
    appId;
    dataQueue;
    isReady = false;
    constructor(options) {
        if (!this.isInRightEnv()) {
            console.log('The current environment does not match the client');
            return;
        }
        this.dataQueue = [];
        this._options = options;
        this.transOptions();
        this.initApp().then((id) => {
            this.appId = id;
            this.isReady = true;
            this.executeUploadData();
        });
    }
    use(plugins) {
        const { enabled, uploadUrl } = this.context;
        const subscriber = new Subscriber();
        for (const plugin of plugins) {
            plugin.monitor.call(this, subscriber.notify.bind(subscriber, plugin.name));
            const callback = (...args) => {
                const pluginDatas = plugin.transform.apply(this, args);
                const clientDatas = this.transform(pluginDatas);
                if (!clientDatas)
                    return;
                if (!enabled)
                    return;
                if (!this.isReady) {
                    this.dataQueue.push(clientDatas);
                }
                this.nextTick(this.report, this, uploadUrl, { appId: this.appId, ...clientDatas });
            };
            subscriber.add(plugin.name, callback);
        }
    }
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
    transOptions() {
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
        this.context = {
            app,
            uploadUrl,
            initUrl,
            debug,
            enabled,
        };
    }
}
//# sourceMappingURL=base.js.map