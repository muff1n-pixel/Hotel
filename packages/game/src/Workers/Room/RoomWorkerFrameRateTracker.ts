export default class RoomWorkerFrameRateTracker {
    private frames: number[] = [];
    private frameRate: number = 0;

    public update(): void {
        const timestamp = performance.now();

        this.frames = this.frames.filter((frame) => frame >= timestamp - 1000);
        this.frames.push(timestamp);

        this.frameRate = this.frames.length;
    }

    public getFrameRate(): number {
        return this.frameRate;
    }

    public getLastFrameTimestamp() {
        return this.frames[this.frames.length - 1] ?? performance.now();
    }
}