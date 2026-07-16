import RoomRenderer from "@Client/Room/RoomRenderer";

export default class RoomRendererFrameCounter {
    public tick: number = 0;

    public frameRate: number = 0;

    private lastTickTimestamp: number = 0;
    private lastFrameTimestamp: number = 0;

    public readonly ticksPerSecond: number = 24;
    public readonly millisecondsPerTick: number = 1000 / this.ticksPerSecond;

    public readonly cappedFramesPerSecond: number = 60;
    public readonly cappedMillisecondsPerFrame: number = 1000 / this.cappedFramesPerSecond;

    constructor(private readonly roomRenderer: RoomRenderer) {
    }

    public shouldProcessTick(): boolean {
        const millisecondsElapsedSinceLastFrame = performance.now() - this.lastTickTimestamp;

        if(millisecondsElapsedSinceLastFrame < this.millisecondsPerTick) {
            return false;
        }

        this.tick = ((this.tick + 1) % this.ticksPerSecond);
        this.lastTickTimestamp = performance.now();

        return true;
    }

    public shouldProcessFrame(): boolean {
        if(!this.roomRenderer.clientInstance?.settings.value?.limitRoomFrames) {
            this.lastFrameTimestamp = performance.now();
            
            return true;
        }
        
        const millisecondsElapsedSinceLastFrame = performance.now() - this.lastFrameTimestamp;
        
        if(millisecondsElapsedSinceLastFrame < this.cappedMillisecondsPerFrame) {
            return false;
        }
        
        this.lastFrameTimestamp = performance.now();

        return true;
    }
}
