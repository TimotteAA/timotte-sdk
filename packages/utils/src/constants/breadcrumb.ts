/**
 * 用户行为栈单个数据类型
 */
export enum BrowserBreadcrumbTypes {
    ROUTE = 'route',
    CLICK = 'ui.click',
    CONSOLE = 'console',
    XHR = 'xhr',
    FETCH = 'fetch',
    UNHANDLEDREJECTION = 'unhandledrejection',
    CODE_ERROR = 'code_error',
    CRASH = 'crash',
    RESOURCE = 'resource',
    CUSTOMER = 'customer',
    FRAMEWORK = 'framework',
    LIFECYCLE = 'lifecycle',
}

/**
 * 用户行为栈的数据级别
 */
export enum BreadcrumbLevel {
    FATAL = 'fatal',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}
