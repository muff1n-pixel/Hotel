import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomCamera from "./RoomCamera";
import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomCursor from "./Cursor/RoomCursor";
import RoomSprite from "./Items/RoomSprite";
import RoomFrameEvent from "@Client/Events/RoomFrameEvent";
import RoomItem from "./Items/RoomItem";
import ClientInstance from "@Client/ClientInstance";
import RoomInstance from "./RoomInstance";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomFurniturePlacer from "./RoomFurniturePlacer";
import RoomLighting from "@Client/Room/RoomLightning";
import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import RoomWallItem from "@Client/Room/Items/Map/RoomWallItem";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomFigureSprite from "@Client/Room/Items/Figure/RoomFigureSprite";
import { RoomPositionData, RoomStructureData, ShopFeatureRoomConfigurationData } from "@pixel63/events";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import RoomFurnitureSprite from "@Client/Room/Items/Furniture/RoomFurnitureSprite";
import RoomRendererFrameCounter from "@Client/Room/Renderer/RoomRendererFrameCounter";
import { Application, Container, Sprite, Texture } from "pixi.js";
import RoomRenderEvent from "@Client/Events/RoomRenderEvent";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";

export default class RoomRenderer extends EventTarget {
    public readonly application: Application;
    public readonly container: Container;

    public readonly camera: RoomCamera;
    public cursor?: RoomCursor;

    public readonly frameCounter = new RoomRendererFrameCounter(this);

    public lighting: RoomLighting;

    public furniturePlacer?: RoomFurniturePlacer;

    private readonly items: RoomItem[] = [];

    //public itemSpritesChanged: boolean = true;

    public scale: number = 1;

    private _previewScale: number = 1;
    public set previewScale(scale: number) {
        this._previewScale = scale;

        this.container.scale = scale;
    }

    public size: number = 64;
    private currentSize: number = 64;
    
    public focusedItem = new ObservableProperty<RoomItem | null>(null);
    public hoveredItem = new ObservableProperty<RoomItem | null>(null);

    private center: MousePosition = {
        left: 0,
        top: 0
    };

    public structure: RoomStructureData;

    constructor(public readonly parent: HTMLElement, public readonly clientInstance: ClientInstance | undefined, public readonly roomInstance: RoomInstance | undefined, structure?: RoomStructureData) {
        super();

        if(!structure) {
            throw new Error();
        }

        this.application = new Application({
            antialias: false
        });
        this.container = new Container();

        this.structure = structure;

        this.camera = new RoomCamera(this);
        this.lighting = new RoomLighting(this);
    }

    public async init() {
        await this.application.init({
            background: "#000000",
            resizeTo: this.parent
        });

        this.application.ticker.add((time) => {
            const shouldProcessTick = this.frameCounter.shouldProcessTick();

            if(shouldProcessTick) {
                this.processTick();
            }
            
            if(this.frameCounter.shouldProcessFrame()) {
                this.processFrame();
            }
        });

        if(this.roomInstance) {
            this.cursor = new RoomCursor(this);
        }

        this.camera.cameraPosition.left = Math.round(this.application.screen.width / 2);
        this.camera.cameraPosition.top = Math.round(this.application.screen.height / 2);
        //this.camera.cameraPosition.top -= (this.structure.grid.length + this.structure.grid[0]?.length) * 6;

        const background = new Sprite(Texture.WHITE);

        background.width = this.application.screen.width;
        background.height = this.application.screen.height;

        background.tint = 0x00;
    
        background.interactive = true;

        background.addListener("click", () => {
            this.focusedItem.value = null;
        });

        this.application.stage.addChild(background);

        this.application.stage.addChild(this.container);

        this.application.canvas.classList.add("renderer");

        this.parent.appendChild(this.application.canvas);
    }

    public addItem(item: RoomItem) {
        if(this.items.includes(item)) {
            return;
        }
        
        this.items.push(item);
    }

    public removeItem(item: RoomItem) {
        const index = this.items.indexOf(item);
        
        if(index === -1) {
            return;
        }
        
        this.items.splice(index, 1);

        item.destroy();
    }

    public setCanvasScale(scale: number) {
        /*this.scale = scale;

        if(this.scale === 1) {
            this.element.style.removeProperty("transform");
        }

        if(this.scale >= 2) {
            this.element.style.imageRendering = "pixelated";
        }
        else {
            this.element.style.imageRendering = "auto";
        }

        this.element.style.transform = `scale(${scale})`;
        this.element.style.transformOrigin = `0 0`;

        this.parent.style.overflow = "hidden";*/
    }

    public terminate() {
        this.application.destroy();
    }

    /*public getSizeScale() {
        return this.currentSize / 64;
    }*/

    private processTick() {
        for(let index = 0; index < this.items.length; index++) {
            this.items[index].process(this.frameCounter.tick);
        }

        this.dispatchEvent(new RoomFrameEvent());
    }

    private processFrame() {
        this.container.x = this.camera.cameraPosition.left;
        this.container.y = this.camera.cameraPosition.top;

        for(let index = 0; index < this.items.length; index++) {
            this.items[index].processPositionPath();
        }

        this.dispatchEvent(new RoomRenderEvent());
    }

    private updateCanvasSize() {
        /*// Automatically clears the context
        if(this.element.width === this.parent.clientWidth && this.element.height === this.parent.clientHeight) {
            //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        }
        else {
            this.element.width = this.parent.clientWidth;
            this.element.height = this.parent.clientHeight;
            
            this.center = {
                left: Math.floor(this.element.width / 2),
                top: Math.floor(this.element.height / 2)
            };
        }*/
    }

    private render() {
        /*if(this.terminated) {
            return;
        }

        const shouldProcessTick = this.frameCounter.shouldProcessTick();

        if(shouldProcessTick) {
            this.processTick();
        }

        if(!this.frameCounter.shouldProcessFrame()) {
            window.requestAnimationFrame(this.render.bind(this));

            return;
        }

        if(shouldProcessTick) {
            this.updateCanvasSize();
        }

        this.frameCounter.updateFrameRate();

        this.processFrame();

        this.renderOffScreen(this.context);

        window.requestAnimationFrame(this.render.bind(this));*/
    }

    private drawBackground(context: CanvasRenderingContext2D) {
        context.fillStyle = this.lighting.backgroundToner?.color ?? "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    private drawLightingForeground(context: CanvasRenderingContext2D) {
        if(!this.lighting.moodlight?.backgroundOnly) {
            this.lighting.render(context);
        }
    }

    /*private renderOffScreen(context: CanvasRenderingContext2D) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        this.drawBackground(context);

        this.updateRenderedOffset();

        if(this.previewScale !== 1) {
            context.save();
            context.translate(this.center.left, this.center.top);
            context.scale(this.previewScale, this.previewScale);
            context.translate(-this.center.left, -this.center.top);
        }

        this.drawSprites(context, this.sortedSprites);

        if(this.previewScale !== 1) {
            context.restore();
        }

        this.drawLightingForeground(context);

        this.dispatchEvent(new RoomRenderEvent());
    }*/

    public getMouseOffsetPosition() {
        if(!this.camera.mousePosition) {
            return null;
        }

        const result = {
            left: Math.round((this.camera.mousePosition.left / this.scale) - this.camera.cameraPosition.left),
            top: Math.round((this.camera.mousePosition.top / this.scale) - this.camera.cameraPosition.top)
        };

        return result;
    }

    public getItemAtPosition(filter?: (item: RoomItem) => boolean): RoomPointerPosition | null {
        if(this.camera.mousePosition) {
            const offsetMousePosition = this.getMouseOffsetPosition();

            if(!offsetMousePosition) {
                return null;
            }

            let filteredItems = this.items;

            if(filter) {
                filteredItems = filteredItems.filter(filter);
            }

            const scale = 1; // this.getSizeScale();

            const sprites = filteredItems.flatMap((item) => item.sprites).sort((a, b) => this.getSpritePriority(b) - this.getSpritePriority(a));

            for(let index = 0; index < sprites.length; index++) {
                const sprite = sprites[index];

                const relativeMousePosition: MousePosition = {
                    left: offsetMousePosition.left,
                    top: offsetMousePosition.top
                };

                if(sprite.item.position) {
                    relativeMousePosition.left = offsetMousePosition.left - ((Math.floor(-(sprite.item.position.row * 32) + (sprite.item.position.column * 32) - 64)) * scale);
                    relativeMousePosition.top = offsetMousePosition.top - ((Math.floor((sprite.item.position.column * 16) + (sprite.item.position.row * 16) - ((Math.round(sprite.item.position.depth * 1000) / 1000) * 32))) * scale);
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

    public getCoordinatePosition(coordinate?: RoomPositionData): MousePosition {
        if(!coordinate) {
            return {
                left: 0,
                top: 0
            };
        }

        return RoomRenderer.getCoordinatePosition(coordinate, 1 /*this.getSizeScale()*/);
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

    private getSpritePriority(sprite: RoomSprite) {
        return sprite.item.calculatedPriority + sprite.priority;
    }

    public getItemCalculatedPriority(item: RoomItem) {
        let priority = item.priority;

        if(item.position) {
            if(Math.floor(item.position.row) === this.structure.door?.row && Math.floor(item.position.column) === this.structure.door.column) {
                if(this.wallItem && this.wallItem.wallRenderer.hasDoorWall) {
                    priority = -2000;
                    priority += (item.position.depth * 100);
                
                    return priority;
                }
            }

            if(item instanceof RoomFurnitureItem) {
                if(item.furnitureRenderer.placement === "wall") {
                    priority = 0;
                    priority += (item.position.depth * 100);
                }
                else {
                    priority += RoomRenderer.getPositionPriority(item.position);
                }
            }
            else {
                priority += RoomRenderer.getPositionPriority(item.position);

                if(item.type === "figure" && item.positionPathData) {
                    priority += 1000;
                }
            }
        }

        return priority;
    }

    public static getPositionPriority(position: RoomPositionData) {
        return (Math.floor(position.row) * 1000) + (Math.floor(position.column) * 1000) + (position.depth * 10);
    }

    public getItemScreenPosition(item: RoomItem): MousePosition {
        if(!item.position) {
            return {
                left: (this.camera.cameraPosition.left * this.scale),
                top: (this.camera.cameraPosition.top * this.scale)
            };
        }

        const translatePosition = this.getCoordinatePosition(item.position);

        if(item instanceof RoomFigureItem) {
            const figureSprite = item.sprites.find<RoomFigureSprite>((sprite) => sprite instanceof RoomFigureSprite);

            if(figureSprite) {
                translatePosition.top += figureSprite.offset.top + 128;

                if(figureSprite.item.figureRenderer.hasAction("Sit")) {
                    translatePosition.top += 16;
                }
            }
        }
        else if(item instanceof RoomPetItem) {
            translatePosition.top -= 16;
        }
        else if(item instanceof RoomFurnitureItem) {
            const furnitureSprites = item.sprites.filter((sprite) => sprite instanceof RoomFurnitureSprite);

            if(furnitureSprites.length) {
                const minOffset = Math.max(...furnitureSprites.map(({ furnitureSprite: sprite }) => sprite.y), 0);

                translatePosition.top += minOffset;
                translatePosition.top -= 24;
            }
        }

        return {
            left: (this.camera.cameraPosition.left + translatePosition.left) * this.scale,
            top: (this.camera.cameraPosition.top + translatePosition.top) * this.scale
        };
    }

    public panToItem(item: RoomItem, offset: MousePosition) {
        if(item instanceof RoomFurnitureItem) {
            if(!item.position) {
                return;
            }

            const dimensions = item.furnitureRenderer.getDimensions();

            const position = this.getCoordinatePosition(RoomPositionData.create({
                row: item.position.row - dimensions.row,
                column: item.position.column - dimensions.column,
                depth: item.position.depth - dimensions.depth,
            }));
            
            //this.camera.cameraPosition.left = position.left + 64;
            //this.camera.cameraPosition.top = position.top / 2;

            this.camera.cameraPosition.left = Math.round((this.application.screen.width / 2) + (Math.max(dimensions.row - 1, 0) * 16) + (Math.max(dimensions.column - 1, 0) * -16) + offset.left);
            this.camera.cameraPosition.top = Math.round((this.application.screen.height / 2) - (Math.max(dimensions.row - 1, 0) * -8) + (Math.max(dimensions.column - 1, 0) * -8) + offset.top);
        }
        else  {
            if(!item.position) {
                return;
            }

            const position = this.getCoordinatePosition(item.position);
            
            this.camera.cameraPosition.left = position.left + 64 + offset.left;
            this.camera.cameraPosition.top = -position.top + offset.top;
        }
    }

    public isPositionInsideStructure(position: RoomPositionData, dimensions: RoomPositionData) {
        for(let row = position.row; row < position.row + dimensions.row; row++) {
            for(let column = position.column; column < position.column + dimensions.column; column++) {
                if(this.structure.grid[row]?.[column] === undefined || this.structure.grid[row]?.[column] === 'X') {
                    return false;
                }
            }   
        }

        return true;
    }

    public isPositionInsideFigure(position: RoomPositionData, dimensions: RoomPositionData, ignoreItem?: RoomItem) {
        for(let row = position.row; row < position.row + dimensions.row; row++) {
            for(let column = position.column; column < position.column + dimensions.column; column++) {
                if(this.items.some((item) => (item instanceof RoomFigureItem) && (item.type === "figure" || item.type === "bot") && (!ignoreItem || !(ignoreItem instanceof RoomFigureItem) || item.id !== ignoreItem.id) && item.position?.row === row && item.position.column === column)) {
                    return true;
                }
            }   
        }

        return false;
    }

    public captureCroppedImage(element: HTMLElement, width: number, height: number) {
        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const clientRectangle = element.getBoundingClientRect();

        if(!clientRectangle) {
            throw new Error("Bounding client rectangle is not available.");
        }

        /*context.drawImage(
            this.element,
            Math.round(clientRectangle.left), Math.round(clientRectangle.top), width, height,
            0, 0, width, height
        );*/

        return canvas;
    }

    public updatePreviewScale() {
        const furnitureItem = this.items.find(
            (item): item is RoomFurnitureItem => item instanceof RoomFurnitureItem
        );

        if(!furnitureItem) {
            this.previewScale = 1;
            return;
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let hasSprites = false;

        for(const roomSprite of furnitureItem.sprites) {
            if(!(roomSprite instanceof RoomFurnitureSprite)) {
                continue;
            }

            const s = roomSprite.sprite;

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

        const canvasWidth = this.application.screen.width;
        const canvasHeight = this.application.screen.height;

        if(canvasWidth <= 0 || canvasHeight <= 0 || furnitureWidth <= 0 || furnitureHeight <= 0) {
            return;
        }

        const padding = 20;
        const scaleX = (canvasWidth - padding) / furnitureWidth;
        const scaleY = (canvasHeight - padding) / furnitureHeight;
        this.previewScale = Math.min(scaleX, scaleY, 1);

        if(this.previewScale < 1 && furnitureItem.position) {
            const screenPos = this.getCoordinatePosition(furnitureItem.position);
            const spriteCenterX = (minX + maxX) / 2;
            const spriteCenterY = (minY + maxY) / 2;

            this.camera.cameraPosition.left = Math.round((this.application.screen.width / 2) + -(screenPos.left + spriteCenterX));
            this.camera.cameraPosition.top = Math.round(-(screenPos.top + spriteCenterY));
        }
    }

    public captureItems(element: HTMLElement, width: number, height: number) {
        const clientRectangle = element.getBoundingClientRect();

        if(!clientRectangle) {
            throw new Error("Bounding client rectangle is not available.");
        }

        const minimumLeft = Math.floor(clientRectangle.left);
        const minimumTop = Math.floor(clientRectangle.top);

        const offsetMousePosition = {
            left: minimumLeft - this.camera.cameraPosition.left,
            top: minimumTop - this.camera.cameraPosition.top
        };

        const scale = 1; /*this.getSizeScale()*/;

        const filteredItems = this.items.filter((item) => {
            return item.sprites.some((sprite) => {
                const relativeMousePosition: MousePosition = {
                    left: offsetMousePosition.left,
                    top: offsetMousePosition.top
                };

                if(sprite.item.position) {
                    relativeMousePosition.left = offsetMousePosition.left - (Math.floor(-(sprite.item.position.row * 32) + (sprite.item.position.column * 32) - 64)) * scale;
                    relativeMousePosition.top = offsetMousePosition.top - (Math.floor((sprite.item.position.column * 16) + (sprite.item.position.row * 16) - ((Math.round(sprite.item.position.depth * 1000) / 1000) * 32))) * scale;
                }

                return sprite.isPositionInsideBounds?.(relativeMousePosition, {
                    left: relativeMousePosition.left + width,
                    top: relativeMousePosition.top + height
                });
            })
        });

        return ShopFeatureRoomConfigurationData.create({
            renderedOffsetLeft: this.camera.cameraPosition.left,
            renderedOffsetTop: this.camera.cameraPosition.top,

            roomFurniture: filteredItems.filter((item) => item instanceof RoomFurnitureItem).map((item) => {
                return {
                    animation: item.furnitureRenderer.animation,
                    color: item.furnitureRenderer.color,
                    direction: item.furnitureRenderer.direction,
                    type: item.furnitureRenderer.type,
                    position: item.position,
                    priority: item.priority
                };
            })
        });
    }

    private floorItem?: RoomFloorItem;
    private wallItem?: RoomWallItem;
    
    public setStructure(structure: RoomStructureData) {
        this.structure = structure;

        if(this.floorItem) {
            this.items.splice(this.items.indexOf(this.floorItem), 1);
            this.floorItem = undefined;
        }

        const floorPromise = new Promise<void>((resolve) => {
            this.floorItem = new RoomFloorItem(
                this,
                new FloorRenderer(structure, structure.floor?.id ?? "default", 64),
                resolve
            );

            this.items.push(this.floorItem);
        });

        if(this.wallItem) {
            this.items.splice(this.items.indexOf(this.wallItem), 1);
            this.wallItem = undefined;
        }

        const wallPromise = new Promise<void>((resolve) => {
            if(!structure.wall?.hidden) {
                this.wallItem = new RoomWallItem(
                    this,
                    new WallRenderer(structure, structure.wall?.id ?? "default", 64),
                    resolve
                );

                this.items.push(this.wallItem);
            }
            else {
                resolve();
            }
        });

        return Promise.allSettled([
            wallPromise,
            floorPromise
        ]);
    }
}
