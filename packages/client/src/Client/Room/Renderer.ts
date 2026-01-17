import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomCamera from "./RoomCamera";
import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomRenderEvent from "@Client/Events/RoomRenderEvent";
import RoomCursor from "./Cursor/RoomCursor";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import RoomSprite from "./Items/RoomSprite";
import Performance from "@Client/Utilities/Performance";
import RoomFrameEvent from "@Client/Events/RoomFrameEvent";
import RoomItem from "./Items/RoomItem";
import ClientInstance from "@Client/ClientInstance";
import RoomInstance from "./RoomInstance";
import RoomFurnitureSprite from "./Items/Furniture/RoomFurnitureSprite";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";

export default class RoomRenderer extends EventTarget {
    public readonly element: HTMLCanvasElement;
    private readonly camera: RoomCamera;
    public readonly cursor?: RoomCursor;

    public readonly items: RoomItem[] = [];

    private terminated = false;

    public frame: number = 0;

    private readonly framesPerSecond: number = 24;
    private readonly millisecondsPerFrame: number = 1000 / this.framesPerSecond;
    private lastFrameTimestamp: number = performance.now();

    private center: MousePosition = {
        left: 0,
        top: 0
    };

    private renderedOffset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly parent: HTMLElement, public readonly clientInstance?: ClientInstance, public readonly roomInstance?: RoomInstance) {
        super();

        this.element = document.createElement("canvas");
        this.element.classList.add("renderer");

        this.camera = new RoomCamera(this);

        if(roomInstance) {
            this.cursor = new RoomCursor(this);
        }

        this.parent.appendChild(this.element);

        window.requestAnimationFrame(this.render.bind(this));
    }

    public terminate() {
        this.terminated = true;

        this.parent.removeChild(this.element);
    }

    private render() {
        if(this.terminated) {
            return;
        }

        const millisecondsElapsedSinceLastFrame = performance.now() - this.lastFrameTimestamp;

        if(millisecondsElapsedSinceLastFrame >= this.millisecondsPerFrame) {
            this.frame = (this.frame + 1) % this.framesPerSecond;
            this.lastFrameTimestamp = performance.now();

            Performance.startPerformanceCheck("Process room items", 5);

            for(let index = 0; index < this.items.length; index++) {
                this.items[index].process(this.frame);
            }

            Performance.endPerformanceCheck("Process room items");

            this.dispatchEvent(new RoomFrameEvent());
        }

        for(let index = 0; index < this.items.length; index++) {
            this.items[index].processPositionPath();
        }

        const boundingRectangle = this.parent.getBoundingClientRect();

        this.center = {
            left: Math.floor(boundingRectangle.width / 2),
            top: Math.floor(boundingRectangle.height / 2)
        };
        
        const image = this.renderOffScreen(boundingRectangle.width, boundingRectangle.height);

        // Automatically clears the context
        this.element.width = boundingRectangle.width;
        this.element.height = boundingRectangle.height;

        const context = this.element.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.drawImage(image, 0, 0);

        window.requestAnimationFrame(this.render.bind(this));
    }

    private renderOffScreen(width: number, height: number) {
        Performance.startPerformanceCheck("Render off screen", 10);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        this.renderedOffset = {
            left: this.center.left + this.camera.cameraPosition.left,
            top: this.center.top + this.camera.cameraPosition.top
        };

        Performance.startPerformanceCheck("Sort room sprites", 5);

        const sprites = this.items.filter((item) => !item.disabled).flatMap((item) => item.sprites).sort((a, b) => {
            return this.getSpritePriority(a) - this.getSpritePriority(b);
        });

        Performance.endPerformanceCheck("Sort room sprites");

        Performance.startPerformanceCheck("Draw room sprites", 5);

        context.translate(this.renderedOffset.left, this.renderedOffset.top);

        for(let index = 0; index < sprites.length; index++) {
            const sprite = sprites[index];

            context.save();

            if(sprite.item.position) {
                const translatePosition = this.getCoordinatePosition(sprite.item.position);

                context.translate(translatePosition.left, translatePosition.top);
            }

            sprite.render(context);

            context.restore();
        }

        Performance.endPerformanceCheck("Draw room sprites");

        Performance.endPerformanceCheck("Render off screen");
        
        this.dispatchEvent(new RoomRenderEvent());

        return canvas;
    }

    public getItemAtPosition(filter?: (item: RoomItem) => boolean): RoomPointerPosition | null {
        if(this.camera.mousePosition) {
            const offsetMousePosition = {
                left: this.camera.mousePosition.left - this.renderedOffset.left,
                top: this.camera.mousePosition.top - this.renderedOffset.top
            };

            let filteredItems = this.items;

            if(filter) {
                filteredItems = filteredItems.filter(filter);
            }

            const sprites = filteredItems.flatMap((item) => item.sprites).sort((a, b) => this.getSpritePriority(b) - this.getSpritePriority(a));

            for(let index = 0; index < sprites.length; index++) {
                const sprite = sprites[index];

                const relativeMousePosition: MousePosition = {
                    left: offsetMousePosition.left,
                    top: offsetMousePosition.top
                };

                if(sprite.item.position) {
                    relativeMousePosition.left = offsetMousePosition.left - Math.floor(-(sprite.item.position.row * 32) + (sprite.item.position.column * 32) - 64);
                    relativeMousePosition.top = offsetMousePosition.top - Math.floor((sprite.item.position.column * 16) + (sprite.item.position.row * 16) - (sprite.item.position.depth * 32));
                }

                const tile = sprite.mouseover(relativeMousePosition);

                if(tile) {
                    return {
                        item: sprite.item,
                        sprite: sprite,
                        position: tile
                    }
                }
            }
        }

        return null;
    }

    public getCoordinatePosition(coordinate: RoomPosition): MousePosition {
        return {
            left: Math.floor(-(coordinate.row * 32) + (coordinate.column * 32) - 64),
            top: Math.floor((coordinate.column * 16) + (coordinate.row * 16) - (coordinate.depth * 32))
        };
    }

    private getSpritePriority(sprite: RoomSprite) {
        let priority = sprite.priority;

        if(sprite.item.position) {
            priority += RoomRenderer.getPositionPriority(sprite.item.position);
        }

        return priority;
    }

    public static getPositionPriority(position: RoomPosition) {
        return (Math.round(position.row) * 1000) + (Math.round(position.column) * 1000) + (position.depth * 100);
    }

    public getItemScreenPosition(item: RoomItem, origin: MousePosition = this.renderedOffset): MousePosition {
        if(!item.position) {
            return {
                left: this.renderedOffset.left,
                top: this.renderedOffset.top
            };

        }

        const translatePosition = this.getCoordinatePosition(item.position);

        return {
            left: this.renderedOffset.left + translatePosition.left,
            top: this.renderedOffset.top + translatePosition.top
        };
    }

    public panToItem(item: RoomItem, offset: MousePosition) {
        if(item instanceof RoomFurnitureItem) {
            if(!item.position) {
                return;
            }

            const dimensions = item.furnitureRenderer.getDimensions();

            /*const position = this.getCoordinatePosition({
                row: item.position.row - dimensions.row,
                column: item.position.column - dimensions.column,
                depth: item.position.depth - dimensions.depth,
            });
            
            this.camera.cameraPosition.left = position.left + 64;
            this.camera.cameraPosition.top = position.top / 2;*/

            this.camera.cameraPosition.left = Math.round((Math.max(dimensions.row - 1, 0) * 16) + (Math.max(dimensions.column - 1, 0) * -16) + offset.left);
            this.camera.cameraPosition.top = Math.round((Math.max(dimensions.row - 1, 0) * -8) + (Math.max(dimensions.column - 1, 0) * -8) + offset.top);
        }
    }
}
