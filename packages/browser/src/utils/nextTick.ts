import { UnknownFunc } from '@timotte-sdk/utils';

// 回调队列
const callbacks: UnknownFunc[] = [];
// 是否正在清空回调
let pending = false;

// 清空回调
const flushCallbacks = () => {
    pending = false;
    console.log(callbacks)
    const callbacksCopy = [...callbacks];
    // 清空回调队列
    callbacks.length = 0;
    while (callbacksCopy.length) {
        const callback = callbacksCopy.shift();
        callback();
    }
};

let counter = 1;

const nextTick = (cb: UnknownFunc) => {
    callbacks.push(cb);
    // 没有执行回调，异步执行
    if (!pending) {
        pending = true;
        if (typeof Promise !== undefined) {
            // 利用resolve后Promise的回调
            Promise.resolve().then(() => flushCallbacks());
        } else if (typeof MutationObserver !== undefined) {
            const textNode = document.createTextNode('' + counter);
            // 观察到节点变化后，执行回调
            const observer = new MutationObserver(flushCallbacks);
            observer.observe(textNode, { characterData: true });
            counter++;
            textNode.textContent = '' + counter;
        } else {
            // setTimeout兜底
            setTimeout(flushCallbacks, 0);
        }
    }
};

export { nextTick };
