import { type ClientContext, type ClientOptions, BasePluginType } from '@timotte-sdk/utils';
export declare abstract class Core<O extends ClientOptions> {
    private readonly _options;
    context: ClientContext;
    protected appId: string;
    protected readonly taskQueue: Array<any>;
    protected isReady: boolean;
    constructor(options: O);
    use(plugins: BasePluginType[]): void;
    executeTaskQueue(): void;
    get options(): O;
    abstract isInRightEnv(): boolean;
    abstract initApp(): Promise<string>;
    abstract transform(data: any): any;
    abstract report(url: string, datas: any, type?: any): void;
    abstract nextTick(cb: Function, ctx: Object, ...args: any[]): void;
    private transOptions;
}
