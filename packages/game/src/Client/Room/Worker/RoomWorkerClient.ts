import { MousePosition } from "@Client/Interfaces/MousePosition";
import { RoomPositionData, RoomStructureData, UserFurnitureCustomData } from "@pixel63/events";

export default class RoomWorkerClient {
    private readonly worker: Worker;

    constructor() {
        this.worker = new Worker(new URL("/src/Workers/RoomWorker.ts", import.meta.url), {
            type: "module"
        });
    }

    public render(canvas: OffscreenCanvas, renderCallback?: (frameRate: number, imageBitmap: ImageBitmap) => void, tickCallback?: () => void) {
        const channel = new MessageChannel();

        channel.port2.onmessage = (event) => {
            switch(event.data.type) {
                case "frame": {
                    renderCallback?.(event.data.frameRate, event.data.imageBitmap);

                    break;
                }

                case "tick": {
                    tickCallback?.();

                    break;
                }
            }
        };
        
        this.worker.postMessage({
            type: "render",
            canvas
        }, [channel.port1, canvas]);
    }

    public setCanvasSize(width: number, height: number) {
        const channel = new MessageChannel();

        this.worker.postMessage({
            type: "setCanvasSize",
            width,
            height
        }, [channel.port1]);
    }

    public setCameraPosition(position: MousePosition) {
        const channel = new MessageChannel();

        this.worker.postMessage({
            type: "setCameraPosition",

            position
        }, [channel.port1]);
    }

    public addFurnitureItem(type: string, direction: number | undefined, animation: number, color: number | undefined, position: RoomPositionData | undefined, data: UserFurnitureCustomData | undefined) {
        const channel = new MessageChannel();

        this.worker.postMessage({
            type: "addFurnitureItem",

            item: {            
                type,
                direction,
                animation,
                color,
                position,
                data
            }
        }, [channel.port1]);
    }

    public setStructure(structure: RoomStructureData) {
        const channel = new MessageChannel();

        this.worker.postMessage({
            type: "setStructure",
            structure
        }, [channel.port1]);
    }

    public terminate() {
        this.worker.terminate();
    }
}

