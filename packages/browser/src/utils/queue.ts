type CallbackFunc = (value?: unknown) => void;

export class TaskQueue {
    private workingCount: number = 0;

    private waitingLists: CallbackFunc[] = [];

    constructor(private max: number) {}

    async addTask(cb: () => Promise<unknown>) {
        if (this.workingCount >= this.max)
            await new Promise((resolve) => this.waitingLists.push(resolve));

        this.workingCount++;
        try {
            await cb();
        } catch (err) {
            console.error(err);
        }
        this.waitingLists.shift()();
        this.workingCount--;
    }
}
