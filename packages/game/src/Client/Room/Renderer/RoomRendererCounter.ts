import RoomFrameEvent from "@Client/Events/RoomFrameEvent";
import RoomRenderer from "./RoomRenderer";
import RoomRenderEvent from "@Client/Events/RoomRenderEvent";
import RoomRendererFrameCounter from "./RoomRendererFrameCounter";

export default class RoomRendererCounter {
    private processingTick = false;

    public readonly frameCounter = new RoomRendererFrameCounter();

    constructor(private readonly renderer: RoomRenderer) {
    }

    public initialize() {
        this.renderer.application.ticker.add(this.handleTick.bind(this));
    }

    private handleTick() {
        if(this.renderer.terminated) {
            return;
        }

        if(!this.processingTick) {
            const shouldProcessTick = this.frameCounter.shouldProcessTick();

            if(shouldProcessTick) {
                this.processTick();
            }
        }
        
        if(this.frameCounter.shouldProcessFrame()) {
            this.processFrame();
        }
    }
    
    private processTick() {
        for(const item of this.renderer.entityManager.entities) {
            if(!item.initialProcessed) {
                item.initialProcessed = true;
            }
            else if(!item.isSpritesInView()) {
                continue;
            }

            item.process(this.frameCounter.tick);
        }

        if(this.frameCounter.tick % 2 === 0) {
            this.renderer.landscape.render();
        }

        this.renderer.dispatchEvent(new RoomFrameEvent());
    }

    private processFrame() {
        this.renderer.container.x = this.renderer.camera.cameraPosition.left;
        this.renderer.container.y = this.renderer.camera.cameraPosition.top;

        for(const item of this.renderer.entityManager.entities) {
            item.processPositionPath();
        }

        this.renderer.dispatchEvent(new RoomRenderEvent());
    }
}