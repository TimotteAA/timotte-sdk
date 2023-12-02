import { RecordAny } from '@timotte-sdk/utils';

import { HttpMethod } from '../constants';

export const sendBeacon = (url: string, data: RecordAny) => {
    if (typeof window === 'undefined') {
        return sendByImg(url, data);
    }
    if (typeof navigator.sendBeacon === 'function') {
        // 用formData去传上报参数
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        return navigator.sendBeacon(url, formData);
    }
    return post(url, data);
};

// 利用img去上传
export const sendByImg = (url: string, data: RecordAny) => {
    let img = new Image();
    // 是否已有query
    const hasQuery = url.indexOf('&') !== -1;
    img.src = `${url}${hasQuery ? '&' : '?'}&data=${encodeURIComponent(JSON.stringify(data))}`;
    img = null;
};

export const xhr = (url: string, data: RecordAny, method: HttpMethod) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        if (method === HttpMethod.GET) {
            const hasQuery = url.indexOf('&') !== -1;
            const requestUrl = `${url}${hasQuery ? '&' : '?'}&data=${encodeURIComponent(
                JSON.stringify(data),
            )}`;
            xhr.open('get', requestUrl);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.responseText);
                }
            };
        } else {
            xhr.open('post', url);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(data));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.responseText);
                }
            };
        }
    });
};

export const post = (url: string, data: RecordAny) => {
    return xhr(url, data, HttpMethod.POST);
};

export const get = (url: string, data: RecordAny) => {
    return xhr(url, data, HttpMethod.GET);
};
