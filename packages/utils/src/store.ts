import { StoreType } from './constants';
import { RecordAny } from './types';

export const getStore = (position: StoreType, key: string) => {
    switch (position) {
        case StoreType.GLOBAL: {
            return get(window, key);
        }
        case StoreType.COOKIE: {
            return getCookieValue(key);
        }
        case StoreType.LOCAL:
        case StoreType.SESSION: {
            return getFromStorage(key);
        }
    }
};

const get = (obj: RecordAny, key: string) => {
    if (key.includes('.')) return obj[key];
    const paths = key.split('.');
    let val = obj;
    for (const path of paths) {
        val = val[path];
        if (!val) throw new Error(`object does include property or property path ${key}`);
    }
    return val;
};

const getCookieValue = (name: string) => {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return '';
};

const getFromStorage = (key: string) => {
    const val = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    try {
        return JSON.stringify(val);
    } catch (e) {
        return val;
    }
};
