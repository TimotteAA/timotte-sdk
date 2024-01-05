export const SDK_APP_ID = '__sdk_app_id';
export const SDK_SESSION_ID = '__sdk_session_id';

/**
 * 前端存储
 */
export enum StoreType {
    SESSION = 'sessionStorage',
    LOCAL = 'localStorage',
    COOKIE = 'cookie',
    GLOBAL = 'window',
}
