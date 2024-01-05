/**
 * 上报事件类型
 */
export enum EventTypes {
    /** api */
    API = 'api',
    /** 性能 */
    PERFORMANCE = 'performance',
    /** 路由变化 */
    ROUTE = 'route',
    /** error
     *
     */
    ERROR = 'error',
    PROMISE_ERROR = 'unhandled_promise_error',
    /**
     * 页面挂壁了
     */
    PAGE_CRASH = 'page_crash',
    USER_BEHAVIOR = 'user_behavior',
}
