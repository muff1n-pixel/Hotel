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

export default class RoomRenderer extends EventTarget {
    public readonly element: HTMLCanvasElement;
    public readonly camera: RoomCamera;
    public readonly cursor?: RoomCursor;

    public lighting: RoomLighting;

    public furniturePlacer?: RoomFurniturePlacer;

    public readonly items: RoomItem[] = [];

    private terminated = false;

    public frame: number = 0;

    private frames: number[] = [];
    public frameRate: ObservableProperty<number> = new ObservableProperty<number>(0);

    public size: number = 64;
    private currentSize: number = 64;

    private readonly framesPerSecond: number = 24;
    private readonly millisecondsPerFrame: number = 1000 / this.framesPerSecond;
    
    public focusedItem = new ObservableProperty<RoomItem | null>(null);
    public hoveredItem = new ObservableProperty<RoomItem | null>(null);

    private readonly cappedFramesPerSecond: number = 60;
    private readonly cappedMillisecondsPerFrame: number = 1000 / this.cappedFramesPerSecond;

    private lastFrameTimestamp: number = performance.now();
    private lastCappedFrameTimestamp: number = performance.now();

    private lastAnimationFrame: number | null = null;

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

        this.camera = new RoomCamera(this);
        this.lighting = new RoomLighting(this);

        if(roomInstance) {
            this.cursor = new RoomCursor(this);
        }

        this.parent.appendChild(this.element);

        window.requestAnimationFrame(this.render.bind(this));
    }

    public terminate() {
        this.terminated = true;

        this.element.remove();
    }

    public getSizeScale() {
        return this.currentSize / 64;
    }

    private render() {
        if(this.terminated) {
            return;
        }

        if(this.lastAnimationFrame !== null) {
            window.cancelAnimationFrame(this.lastAnimationFrame);
        }

        const millisecondsElapsedSinceLastFrame = performance.now() - this.lastFrameTimestamp;

        if(millisecondsElapsedSinceLastFrame >= this.millisecondsPerFrame) {
            this.frame = ((this.frame + 1) % this.framesPerSecond);
            this.lastFrameTimestamp = performance.now();

            this.currentSize = this.size;

            for(let index = 0; index < this.items.length; index++) {
                this.items[index].process(this.frame);
            }

            this.dispatchEvent(new RoomFrameEvent());
        }
        else if(this.clientInstance?.settings.value?.limitRoomFrames && (performance.now() - this.lastCappedFrameTimestamp) < this.cappedMillisecondsPerFrame) {
            window.requestAnimationFrame(this.render.bind(this));

            return;
        }
        
        this.lastCappedFrameTimestamp = performance.now();

        const boundingRectangle = this.parent.getBoundingClientRect();

        this.center = {
            left: Math.floor(boundingRectangle.width / 2),
            top: Math.floor(boundingRectangle.height / 2)
        };

        // Automatically clears the context
        this.element.width = boundingRectangle.width;
        this.element.height = boundingRectangle.height;

        const context = this.element.getContext("2d", {
            alpha: false
        });

        if(!context) {
            throw new ContextNotAvailableError();
        }
        
        this.renderOffScreen(context);

        const timestamp = performance.now();

        this.frames = this.frames.filter((frame) => frame >= timestamp - 1000);
        this.frames.push(timestamp);

        this.frameRate.value = this.frames.length;
        
        this.lastAnimationFrame = window.requestAnimationFrame(this.render.bind(this));
    }

    private renderOffScreen(context: CanvasRenderingContext2D) {
        context.fillStyle = this.lighting.backgroundToner?.color ?? "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        this.renderedOffset = {
            left: this.center.left + this.camera.cameraPosition.left,
            top: this.center.top + this.camera.cameraPosition.top
        };

        const sprites = this.items.flatMap((item) => {
            item.processPositionPath();

            if(item.disabled) {
                return [];
            }

            return item.sprites;
        }).sort((a, b) => {
            return this.getSpritePriority(a) - this.getSpritePriority(b);
        });

        context.translate(this.renderedOffset.left, this.renderedOffset.top);

        for(let index = 0; index < sprites.length; index++) {
            const sprite = sprites[index];

            context.save();

            if(sprite.item.position) {
                const translatePosition = this.getCoordinatePosition(sprite.item.position);

                context.translate(translatePosition.left, translatePosition.top);
            }

            context.globalAlpha = sprite.item.alpha;

            sprite.render(context as any as OffscreenCanvasRenderingContext2D);

            context.restore();
        }

        context.resetTransform();

        if(!this.lighting.moodlight?.backgroundOnly) {
            this.lighting.render(context);
        }

        this.dispatchEvent(new RoomRenderEvent());
    }

    public getMouseOffsetPosition() {
        if(!this.camera.mousePosition) {
            return null;
        }

        const result = {
            left: this.camera.mousePosition.left - this.renderedOffset.left,
            top: this.camera.mousePosition.top - this.renderedOffset.top
        };

        const scale = this.getSizeScale();

        result.left *= scale;
        result.top *= scale;

        return result;
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

            const scale = this.getSizeScale();

            const sprites = filteredItems.flatMap((item) => item.sprites).sort((a, b) => this.getSpritePriority(b) - this.getSpritePriority(a));

            for(let index = 0; index < sprites.length; index++) {
                const sprite = sprites[index];

                const relativeMousePosition: MousePosition = {
                    left: offsetMousePosition.left,
                    top: offsetMousePosition.top
                };

                if(sprite.item.position) {
                    relativeMousePosition.left = offsetMousePosition.left - (Math.floor(-(sprite.item.position.row * 32) + (sprite.item.position.column * 32) - 64)) * scale;
                    relativeMousePosition.top = offsetMousePosition.top - (Math.floor((sprite.item.position.column * 16) + (sprite.item.position.row * 16) - ((Math.round(sprite.item.position.depth * 1000) / 1000) * 32))) * scale;
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

    public getCoordinatePosition(coordinate: RoomPositionData): MousePosition {
        return RoomRenderer.getCoordinatePosition(coordinate, this.getSizeScale());
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
        let priority = sprite.item.priority + sprite.priority;

        if(sprite.item.position) {
            if(Math.round(sprite.item.position.row) === this.structure.door?.row && Math.round(sprite.item.position.column) === this.structure.door.column) {
                if(this.wallItem && this.wallItem.wallRenderer.hasDoorWall) {
                    priority = -2000;
                    priority += (sprite.item.position.depth * 100);
                
                    return priority;
                }
            }

            if(sprite.item instanceof RoomFurnitureItem) {
                if(sprite.item.furnitureRenderer.placement === "wall") {
                    priority = 0;
                    priority += (sprite.item.position.depth * 100);
                }
                else {
                    priority += RoomRenderer.getPositionPriority(sprite.item.position);
                }
            }
            else {
                priority += RoomRenderer.getPositionPriority(sprite.item.position);
            }
        }

        return priority;
    }

    public static getPositionPriority(position: RoomPositionData) {
        return (Math.round(position.row) * 1000) + (Math.round(position.column) * 1000) + (position.depth * 100);
    }

    public getItemScreenPosition(item: RoomItem): MousePosition {
        if(!item.position) {
            return {
                left: this.renderedOffset.left,
                top: this.renderedOffset.top
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

        const scale = this.getSizeScale();

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
