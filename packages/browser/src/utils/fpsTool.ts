import { formatDecimal } from '@timotte-sdk/utils';

class FpsTool {
    // 上一次记录时间
    private lastTime: number;
    private frame: number;
    private fps: number;
    private lastFameTime: number;
    // raf id
    private animationFramId: number;
    constructor() {
        this.frame = 0;
        this.fps = 0;
        this.lastFameTime = performance.now();
    }
    run() {
        const now = performance.now();
        // 两次时间差值
        const fs = now - this.lastFameTime;
        this.lastFameTime = now;
        // 当前这一个raf的帧率
        this.fps = Math.round(1000 / fs);
        this.frame++;
        // 已经过去1s
        if (now > 1000 + this.lastTime) {
            this.fps = Math.round((this.frame * 1000) / (now - this.lastTime));
            this.frame = 0;
            this.lastTime = now;
        }
        this.animationFramId = window.requestAnimationFrame(() => {
            this.run();
        });
    }
    get(): number {
        return formatDecimal(this.fps, 3);
    }
    destroy() {
        cancelAnimationFrame(this.animationFramId);
    }
}

export { FpsTool };
