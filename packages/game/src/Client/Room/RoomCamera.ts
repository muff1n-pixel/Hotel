import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomRenderer from "./Renderer/RoomRenderer";
import RoomFurnitureSprite from "./Items/Furniture/RoomFurnitureSprite";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomFurnitureOffsets from "./Items/Furniture/RoomFurnitureOffsets";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { Rectangle } from "pixi.js";

export default class RoomCamera {
    private moving: boolean = false;

    public dragging: boolean = false;

    private lastPosition: MousePosition | null = null;

    public mousePosition: MousePosition | null = null;

    public cameraPosition: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(private readonly renderer: RoomRenderer) {
        
    }
    
    public getMouseOffsetPosition() {
        if(!this.mousePosition) {
            return null;
        }

        const result = {
            left: Math.round((this.mousePosition.left - this.cameraPosition.left)/ this.renderer.scale.value),
            top: Math.round((this.mousePosition.top - this.cameraPosition.top)/ this.renderer.scale.value)
        };

        return result;
    }

    public panToOffset(offset: MousePosition) {
        this.cameraPosition.left = Math.round((this.renderer.application.screen.width / 2) + offset.left);
        this.cameraPosition.top = Math.round((this.renderer.application.screen.height / 2) + offset.top);
    }

    public updatePreviewScale() {
        const furnitureItem = this.renderer.entityManager.entities.find(
            (item): item is RoomFurnitureItem => item instanceof RoomFurnitureItem
        );

        if(!furnitureItem) {
            this.renderer.scale.value = 1;
            
            return;
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let hasSprites = false;

        for(const roomSprite of furnitureItem.sprites) {
            if(!(roomSprite instanceof RoomFurnitureSprite)) {
                continue;
            }

            const s = roomSprite._sprite;

            const offset = RoomFurnitureOffsets.getDefaultOffsetPosition(furnitureItem.furnitureRenderer, roomSprite.furnitureSprite, 1);

            minX = Math.min(minX, offset.left);
            minY = Math.min(minY, offset.top);
            maxX = Math.max(maxX, offset.left + s.width);
            maxY = Math.max(maxY, offset.top + s.height);
            hasSprites = true;
        }

        if(!hasSprites) {
            return;
        }

        const furnitureWidth = maxX - minX;
        const furnitureHeight = maxY - minY;

        const canvasWidth = this.renderer.application.screen.width;
        const canvasHeight = this.renderer.application.screen.height;

        if(canvasWidth <= 0 || canvasHeight <= 0 || furnitureWidth <= 0 || furnitureHeight <= 0) {
            return;
        }

        const padding = 20;
        const scaleX = (canvasWidth - padding) / furnitureWidth;
        const scaleY = (canvasHeight - padding) / furnitureHeight;
        
        this.renderer.scale.value = Math.min(scaleX, scaleY, 1);

        if(furnitureItem.position) {
            const screenPos = this.renderer.coordinateMapper.getCoordinatePosition(furnitureItem.position);
            const spriteCenterX = (minX + maxX) / 2;
            const spriteCenterY = (minY + maxY) / 2;

            this.cameraPosition.left = Math.round((this.renderer.application.screen.width / 2) + -(screenPos.left + spriteCenterX));
            this.cameraPosition.top = Math.round((this.renderer.application.screen.height / 2) + -(screenPos.top + spriteCenterY));
        }
        else {
            this.cameraPosition.left = Math.round((this.renderer.application.screen.width / 2));
            this.cameraPosition.top = Math.round((this.renderer.application.screen.height / 2));
        }
    }

    public async captureCroppedImage(element: HTMLElement, width: number, height: number) {
        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const clientRectangle = element.getBoundingClientRect();

        if(!clientRectangle) {
            throw new Error("Bounding client rectangle is not available.");
        }

        const extracted = this.renderer.application.renderer.extract.canvas({
            target: this.renderer.application.stage,
            frame: new Rectangle(Math.round(clientRectangle.left), Math.round(clientRectangle.top), width, height),
        });

        const image = extracted as HTMLCanvasElement;

        context.drawImage(
            image,
            0, 0, image.width, image.height,
            0, 0, width, height
        );

        return canvas;
    }

    public init() {
        if(this.renderer.roomInstance) {
            this.renderer.application.canvas.addEventListener("touchstart", this.touchstart.bind(this));
            this.renderer.application.canvas.addEventListener("touchmove", this.touchmove.bind(this));
            this.renderer.application.canvas.addEventListener("touchend", this.touchend.bind(this));

            this.renderer.application.canvas.addEventListener("mousedown", this.mousedown.bind(this));
            this.renderer.application.canvas.addEventListener("mousemove", this.mousemove.bind(this));
            this.renderer.application.canvas.addEventListener("mouseup", this.mouseup.bind(this));
            this.renderer.application.canvas.addEventListener("mouseleave", this.mouseleave.bind(this));
            this.renderer.application.canvas.addEventListener("wheel", this.wheel.bind(this));
        }
    }

    private wheel(event: WheelEvent) {
        if(this.renderer.furniturePlacer) {
            return;
        }
        
        if(event.deltaY < 0) {
            this.renderer.scale.value = (Math.min(5, this.renderer.scale.value + 0.1));
        }
        else {
            this.renderer.scale.value = (Math.max(1, this.renderer.scale.value - 0.1));
        }
    }

    private mousedown(event: MouseEvent) {
        if(event.ctrlKey || event.shiftKey || (event.altKey || event.metaKey)) {
            return;
        }

        this.moving = true;
        this.dragging = false;

        this.lastPosition = {
            left: event.pageX,
            top: event.pageY
        };
    }

    private mousemove(event: MouseEvent) {
        this.mousePosition = {
            left: event.pageX,
            top: event.pageY
        };

        if(!this.moving || !this.lastPosition) {
            return;
        }

        const relativePosition: MousePosition = {
            left: event.pageX - this.lastPosition.left,
            top: event.pageY - this.lastPosition.top,
        };

        this.cameraPosition.left += relativePosition.left;
        this.cameraPosition.top += relativePosition.top;

        if(Math.abs(relativePosition.left) > 2 || Math.abs(relativePosition.top) > 2) {
            this.dragging = true;
        }

        this.lastPosition = {
            left: event.pageX,
            top: event.pageY
        };
    }

    private mouseup(event: MouseEvent) {
        this.mousemove(event);

        this.moving = false;
        this.lastPosition = null;
        this.dragging = false;
    }

    private mouseleave() {
        this.mousePosition = null;
    }

    private touchstart(event: TouchEvent) {
        if(event.ctrlKey || event.shiftKey || (event.altKey || event.metaKey)) {
            return;
        }

        this.moving = true;
        this.dragging = false;

        const touch = event.touches[0];

        this.lastPosition = {
            left: touch.pageX,
            top: touch.pageY
        };
    }

    private touchmove(event: TouchEvent) {
        const touch = event.touches[0];

        this.mousePosition = {
            left: touch.pageX,
            top: touch.pageY
        };

        if(!this.moving || !this.lastPosition) {
            return;
        }

        const relativePosition: MousePosition = {
            left: touch.pageX - this.lastPosition.left,
            top: touch.pageY - this.lastPosition.top,
        };

        this.cameraPosition.left += relativePosition.left;
        this.cameraPosition.top += relativePosition.top;

        if(Math.abs(relativePosition.left) > 2 || Math.abs(relativePosition.top) > 2) {
            this.dragging = true;
        }

        this.lastPosition = {
            left: touch.pageX,
            top: touch.pageY
        };
    }

    private touchend() {
        this.moving = false;
        this.lastPosition = null;
        this.dragging = false;
    }
}