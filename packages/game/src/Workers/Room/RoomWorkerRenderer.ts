import RoomWorkerFurniture from "src/Workers/Room/Interfaces/RoomWorkerFurniture";
import RoomWorkerFrameRateTracker from "./RoomWorkerFrameRateTracker";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import { RoomPositionData } from "@pixel63/events";
import { MousePosition } from "@Client/Interfaces/MousePosition";

export default class RoomWorkerRenderer {
    private frameTracker: RoomWorkerFrameRateTracker;

    private width: number = 0;
    private height: number = 0;

    private tick: number = 0;
    private lastTickTimestamp: number = performance.now();

    private readonly ticksPerSecond: number = 24;
    private readonly millisecondsPerTick: number = 1000 / this.ticksPerSecond;

    public size = 64;

    public readonly items: RoomItem[] = [];

    public itemPositionMap: Map<string, RoomItem[]> = new Map();

    private cameraPosition: MousePosition = {
        left: 0,
        top: 0
    };

    constructor() {
        this.frameTracker = new RoomWorkerFrameRateTracker();
    }

    public setCameraPosition(position: MousePosition) {
        this.cameraPosition = position;
    }

    public setCanvasSize(width: number, height: number): void {
        console.log("Setting canvas size in room worker renderer", width, height);
    
        this.width = width;
        this.height = height;
    }

    public render(canvas: OffscreenCanvas, port: MessagePort): void {
        const context = this.getContext(canvas);

        self.requestAnimationFrame(this.handleAnimationFrame.bind(this, context, port));
    }

    private handleAnimationFrame(context: OffscreenCanvasRenderingContext2D, port: MessagePort): void {
        context.canvas.width = this.width;
        context.canvas.height = this.height;

        this.drawFrame(context);

        console.log("FPS: " + this.frameTracker.getFrameRate());
        
        const millisecondsElapsedSinceLastTick = performance.now() - this.lastTickTimestamp;

        if(millisecondsElapsedSinceLastTick >= this.millisecondsPerTick) {
            this.tick = ((this.tick + 1) % this.ticksPerSecond);
            this.lastTickTimestamp = performance.now();

            port.postMessage({ type: "tick" });
            
            for(let index = 0; index < this.items.length; index++) {
                this.items[index].process(this.tick);
            }
        }

        this.frameTracker.update();

        self.requestAnimationFrame(this.handleAnimationFrame.bind(this, context, port));
    }

    private drawFrame(context: OffscreenCanvasRenderingContext2D): void {
        for(let index = 0; index < this.items.length; index++) {
            this.items[index].processPositionPath();
        }

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        const sprites = this.items
            .filter(item => !item.disabled)
            .flatMap(item => item.sprites)
            .sort((a, b) => {
                const priorityA = a.item.calculatedPriority + a.priority;
                const priorityB = b.item.calculatedPriority + b.priority;
                return priorityA - priorityB;
            });

        const offset: MousePosition = {
            left: Math.floor(context.canvas.width / 2) + this.cameraPosition.left,
            top: Math.floor(context.canvas.height / 2) + this.cameraPosition.top,
        };

        for(let index = 0; index < sprites.length; index++) {
            const sprite = sprites[index];

            sprite.render(context as any as OffscreenCanvasRenderingContext2D, offset.left + sprite.item.screenPosition.left, offset.top + sprite.item.screenPosition.top);
        }

        context.fillStyle = "red";
        context.fillRect(0, 0, 10, 10);

        context.fillText("FPS: " + this.frameTracker.getFrameRate(), 20, 20);
        context.fillText("Sprites: " + sprites.length, 20, 40);
    }

    private getContext(canvas: OffscreenCanvas): OffscreenCanvasRenderingContext2D {
        console.log({ canvas });

        const context = canvas.getContext("2d", {
            alpha: false
        });

        if(!context) {
            throw new Error("Could not get 2D context in room worker renderer");
        }

        return context;
    }
    
    public getItemCalculatedPriority(item: RoomItem) {
        let priority = item.priority;

        if(item.position) {
            if(item instanceof RoomFurnitureItem) {
                if(item.furnitureRenderer.placement === "wall") {
                    priority = 0;
                    priority += (item.position.depth * 100);
                }
                else {
                    priority += RoomWorkerRenderer.getPositionPriority(item.position);
                }
            }
            else {
                priority += RoomWorkerRenderer.getPositionPriority(item.position);
            }
        }

        return priority;
    }
    
    public static getPositionPriority(position: RoomPositionData) {
        return (Math.round(position.row) * 1000) + (Math.round(position.column) * 1000) + (position.depth * 10);
    }
    
    public getCoordinatePosition(coordinate?: RoomPositionData): MousePosition {
        if(!coordinate) {
            return {
                left: 0,
                top: 0
            };
        }

        return RoomWorkerRenderer.getCoordinatePosition(coordinate, 1 /*this.getSizeScale()*/);
    }

    public static getCoordinatePosition(coordinate: RoomPositionData, scale: number) {
        const result = {
            left: Math.round(-(coordinate.row * 32) + (coordinate.column * 32) - 64),
            top: Math.round((coordinate.column * 16) + (coordinate.row * 16) - ((Math.round(coordinate.depth * 1000) / 1000) * 32))
        };

        result.left *= scale;
        result.top *= scale;

        return result;
    }
}
