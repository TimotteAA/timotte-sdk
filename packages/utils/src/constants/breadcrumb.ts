export enum BrowserBreadcrumbTypes {
    ROUTE = 'route',
    CLICK = 'ui.click',
    CONSOLE = 'console',
    XHR = 'xhr',
    FETCH = 'fetch',
    UNHANDLEDREJECTION = 'unhandledrejection',
    CODE_ERROR = 'code_error',
    CRASH = 'crash',
}

export enum BreadcrumbLevel {
    FATAL = 'fatal',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}
