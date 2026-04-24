import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomCamera from "./RoomCamera";
import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomRenderEvent from "@Client/Events/RoomRenderEvent";
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
import { RoomPositionData, RoomPositionOffsetData, RoomStructureData, ShopFeatureRoomConfigurationData } from "@pixel63/events";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import RoomFurnitureSprite from "@Client/Room/Items/Furniture/RoomFurnitureSprite";
import RoomRendererFrameCounter from "@Client/Room/Renderer/RoomRendererFrameCounter";

export default class RoomRenderer extends EventTarget {
    public readonly element: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    public readonly camera: RoomCamera;
    public readonly cursor?: RoomCursor;

    public readonly frameCounter = new RoomRendererFrameCounter(this);

    public lighting: RoomLighting;

    public furniturePlacer?: RoomFurniturePlacer;

    public readonly items: RoomItem[] = [];

    //public itemSpritesChanged: boolean = true;
    private sortedSprites: RoomSprite[] = [];

    private terminated = false;

    public scale: number = 1;

    public size: number = 64;
    private currentSize: number = 64;
    
    public focusedItem = new ObservableProperty<RoomItem | null>(null);
    public hoveredItem = new ObservableProperty<RoomItem | null>(null);

    public itemPositionMap: Map<string, RoomItem[]> = new Map();

    private center: MousePosition = {
        left: 0,
        top: 0
    };

    public renderedOffset: MousePosition = {
        left: 0,
        top: 0
    };

    public structure: RoomStructureData;

    constructor(public readonly parent: HTMLElement, public readonly clientInstance: ClientInstance | undefined, public readonly roomInstance: RoomInstance | undefined, structure?: RoomStructureData) {
        super();

        if(!structure) {
            throw new Error();
        }

        this.structure = structure;

        this.element = document.createElement("canvas");
        this.element.classList.add("renderer");

        this.updateCanvasSize();

        this.context = this.element.getContext("2d", {
            alpha: false
        })!;

        this.camera = new RoomCamera(this);
        this.lighting = new RoomLighting(this);

        if(roomInstance) {
            this.cursor = new RoomCursor(this);
        }

        this.parent.appendChild(this.element);

        window.requestAnimationFrame(this.render.bind(this));
    }

    public setCanvasScale(scale: number) {
        this.scale = scale;

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

        this.parent.style.overflow = "hidden";
    }

    public terminate() {
        this.terminated = true;

        this.element.remove();
    }

    /*public getSizeScale() {
        return this.currentSize / 64;
    }*/

    private processTick() {
        for(let index = 0; index < this.items.length; index++) {
            this.items[index].process(this.frameCounter.tick);
        }

        this.sortSprites();

        this.dispatchEvent(new RoomFrameEvent());
    }

    private processFrame() {
        for(let index = 0; index < this.items.length; index++) {
            this.items[index].processPositionPath();
        }
    }

    private updateCanvasSize() {
        // Automatically clears the context
        if(this.element.width === this.parent.clientWidth && this.element.height === this.parent.clientHeight) {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        }
        else {
            this.element.width = this.parent.clientWidth;
            this.element.height = this.parent.clientHeight;
            
            this.center = {
                left: Math.floor(this.element.width / 2),
                top: Math.floor(this.element.height / 2)
            };
        }
    }

    private render() {
        if(this.terminated) {
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

        window.requestAnimationFrame(this.render.bind(this));
    }

    private drawBackground(context: CanvasRenderingContext2D) {
        context.fillStyle = this.lighting.backgroundToner?.color ?? "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    private updateRenderedOffset() {
        this.renderedOffset = {
            left: Math.round((this.center.left + this.camera.cameraPosition.left) / this.scale),
            top: Math.round((this.center.top + this.camera.cameraPosition.top) / this.scale)
        };
    }

    private sortSprites() {
        this.sortedSprites = this.items
            .filter(item => !item.disabled)
            .flatMap(item => item.sprites)
            .sort((a, b) => {
                const priorityA = a.item.calculatedPriority + a.priority;
                const priorityB = b.item.calculatedPriority + b.priority;
                return priorityA - priorityB;
            });
    }

    private drawSprites(context: CanvasRenderingContext2D, sprites: RoomSprite[]) {
        for(let index = 0; index < sprites.length; index++) {
            const sprite = sprites[index];

            context.globalCompositeOperation = "source-over";
            context.globalAlpha = sprite.item.alpha;

            sprite.render(context as any as OffscreenCanvasRenderingContext2D, this.renderedOffset.left + sprite.item.screenPosition.left, this.renderedOffset.top + sprite.item.screenPosition.top);
        }
    }

    private drawLightingForeground(context: CanvasRenderingContext2D) {
        if(!this.lighting.moodlight?.backgroundOnly) {
            this.lighting.render(context);
        }
    }

    private renderOffScreen(context: CanvasRenderingContext2D) {
        this.drawBackground(context);

        this.updateRenderedOffset();
        
        this.drawSprites(context, this.sortedSprites);

        this.drawLightingForeground(context);

        this.dispatchEvent(new RoomRenderEvent());
    }

    public getMouseOffsetPosition() {
        if(!this.camera.mousePosition) {
            return null;
        }

        const result = {
            left: Math.round((this.camera.mousePosition.left / this.scale) - this.renderedOffset.left),
            top: Math.round((this.camera.mousePosition.top / this.scale) - this.renderedOffset.top)
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
            if(Math.round(item.position.row) === this.structure.door?.row && Math.round(item.position.column) === this.structure.door.column) {
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
            }
        }

        return priority;
    }

    public static getPositionPriority(position: RoomPositionData) {
        return (Math.round(position.row * 2) / 2 * 1000) + (Math.round(position.column * 2) / 2 * 1000) + (position.depth * 10);
    }

    public getItemScreenPosition(item: RoomItem): MousePosition {
        if(!item.position) {
            return {
                left: (this.renderedOffset.left * this.scale),
                top: (this.renderedOffset.top * this.scale)
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
                const minOffset = Math.max(...furnitureSprites.map(({ sprite }) => sprite.y), 0);

                translatePosition.top += minOffset;
                translatePosition.top -= 24;
            }
        }

        return {
            left: (this.renderedOffset.left + translatePosition.left) * this.scale,
            top: (this.renderedOffset.top + translatePosition.top) * this.scale
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

        context.drawImage(
            this.element,
            Math.round(clientRectangle.left), Math.round(clientRectangle.top), width, height,
            0, 0, width, height
        );

        return canvas;
    }

    public captureItems(element: HTMLElement, width: number, height: number) {
        const clientRectangle = element.getBoundingClientRect();

        if(!clientRectangle) {
            throw new Error("Bounding client rectangle is not available.");
        }

        const minimumLeft = Math.floor(clientRectangle.left);
        const minimumTop = Math.floor(clientRectangle.top);

        const offsetMousePosition = {
            left: minimumLeft - this.renderedOffset.left,
            top: minimumTop - this.renderedOffset.top
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
            renderedOffsetLeft: this.renderedOffset.left,
            renderedOffsetTop: this.renderedOffset.top,

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

        this.floorItem = new RoomFloorItem(
            this,
            new FloorRenderer(structure, structure.floor?.id ?? "default", 64),
        );

        this.items.push(this.floorItem);

        if(this.wallItem) {
            this.items.splice(this.items.indexOf(this.wallItem), 1);
            this.wallItem = undefined;
        }

        if(!structure.wall?.hidden) {
            this.wallItem = new RoomWallItem(
                this,
                new WallRenderer(structure, structure.wall?.id ?? "default", 64)
            );

            this.items.push(this.wallItem);
        }
    }

    public getSortedFurnitureAtPosition(position: RoomPositionData) {
        const items = this.itemPositionMap.get(`${position.row}x${position.column}`);

        if(!items) {
            return [];
        }

        return items.filter((item) => item instanceof RoomFurnitureItem).toSorted((a, b) => (b.position?.depth ?? 0) - (a.position?.depth ?? 0));
    }
}
