export class Subscriber {
    map = new Map();
    add(pluginName, callback) {
        if (!this.map.has(pluginName)) {
            this.map.set(pluginName, [callback]);
        }
        else {
            this.map.set(pluginName, this.map.get(pluginName).concat(callback));
        }
    }
    notify(pluginName, notify) {
        if (!this.map.has(pluginName))
            return;
        const fns = this.map.get(pluginName);
        if (Array.isArray(fns) && fns.length) {
            fns.forEach((fn) => {
                fn.call(this, notify);
            });
        }
    }
}
//# sourceMappingURL=subscriber.js.map