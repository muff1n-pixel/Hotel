import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomCamera from "../RoomCamera";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomCursor from "../Cursor/RoomCursor";
import RoomSprite from "../Items/RoomSprite";
import RoomItem from "../Items/RoomItem";
import ClientInstance from "@Client/ClientInstance";
import RoomInstance from "../RoomInstance";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomFurniturePlacer from "../RoomFurniturePlacer";
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
import { Application, Container, Rectangle } from "pixi.js";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";
import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";
import RoomStructure from "@Client/Room/Structure/RoomStructure";
import RoomLandscape from "@Client/Room/Landscape/RoomLandscape";
import RoomPriority from "../Items/RoomPriority";
import RoomRendererCounter from "./RoomRendererCounter";
import RoomEntityManager from "./Entities/RoomEntityManager";
import RoomHitTester from "./RoomHitTester";
import RoomCoordinateMapper from "./RoomCoordinateMapper";

export default class RoomRenderer extends EventTarget {
    public readonly application = new Application();
    public readonly container = new Container();

    public readonly counter = new RoomRendererCounter(this);
    public readonly entityManager = new RoomEntityManager(this);
    public readonly hitTester = new RoomHitTester(this);
    public readonly coordinateMapper = new RoomCoordinateMapper(this);

    public readonly camera: RoomCamera;
    public cursor?: RoomCursor;

    public lighting: RoomLighting;
    public structure: RoomStructure;
    public landscape: RoomLandscape;

    public furniturePlacer?: RoomFurniturePlacer;

    public scale = new ObservableRequiredProperty<number>(1);
    private scaleSubscription: () => void;
    private subscriptions: ((() => void) | undefined)[] = [];

    private _previewScale: number = 1;
    public set previewScale(scale: number) {
        this._previewScale = scale;

        this.container.scale = scale;
    }

    public size: number = 64;
    private currentSize: number = 64;
    
    public focusedItem = new ObservableProperty<RoomItem | null>(null);
    public hoveredItem = new ObservableProperty<RoomItem | null>(null);

    constructor(public readonly parent: HTMLElement, public readonly clientInstance: ClientInstance | undefined, public readonly roomInstance: RoomInstance | undefined, structure?: RoomStructureData) {
        super();

        if(!structure) {
            throw new Error();
        }

        this.structure = new RoomStructure(this, structure);
        this.landscape = new RoomLandscape(this);

        this.camera = new RoomCamera(this);
        this.lighting = new RoomLighting(this);

        this.scaleSubscription = this.scale.subscribe((value) => {
            this.container.scale = value;

            if(value <= 0.75) {
                this.size = 32;
            }
            else {
                this.size = 64;
            }
        });
    }

    public terminated: boolean = false;

    public terminate() {
        if(this.terminated) {
            return;
        }

        this.terminated = true;

        this.cursor?.destroy();
        this.landscape.destroy();

        this.scaleSubscription();

        for(const subscription of this.subscriptions) {
            subscription?.();
        }

        this.application.renderer.destroy({
            removeView: true
        });
    }

    public async init() {
        const resolution = Math.min(2, Math.max(1, Math.floor(window.devicePixelRatio)));

        await this.application.init({
            antialias: false,
            background: "#000000",
            resizeTo: this.parent,
            roundPixels: resolution !== 1,

            useBackBuffer: true,

            resolution: resolution,
            autoDensity: resolution !== 1,
        });

        this.counter.initialize();

        this.camera.init();

        if(resolution !== 1) {
            this.application.canvas.style.imageRendering = "pixelated";
        }

        this.subscriptions.push(this.clientInstance?.settings.subscribe((value) => {
            if(value.limitRoomFrames) {
                this.application.ticker.maxFPS = 60;
            }
            else {
                this.application.ticker.maxFPS = 0;
            }
        }));

        if(window.screen.width > 1920) {
            if(this.clientInstance?.settings.value.autoScaleRooms) {
                this.scale.value = 2;
            }
        }

        if(this.roomInstance) {
            this.cursor = new RoomCursor(this);
        }

        this.camera.cameraPosition.left = Math.round(this.application.screen.width / 2);
        this.camera.cameraPosition.left -= (this.structure.data.grid[0].length * 8) - (this.structure.data.grid.length * 8);
        
        this.camera.cameraPosition.top = Math.round(this.application.screen.height / 2);
        this.camera.cameraPosition.top -= (this.structure.data.grid.length + this.structure.data.grid[0]?.length) * 8;

        this.lighting.init();

        this.application.stage.addChild(this.container);

        this.application.canvas.classList.add("renderer");

        this.parent.appendChild(this.application.canvas);

        await this.structure.setStructure(this.structure.data);
    }

    public getSpritePriority(sprite: RoomSprite) {
        return sprite.item.calculatedPriority + sprite.priority;
    }

    public getItemCalculatedPriority(item: RoomItem) {
        let priority = item.priority;

        if(item.position) {
            if(Math.round(item.position.row) === this.structure.data.door?.row && Math.round(item.position.column) === this.structure.data.door.column) {
                if(this.entityManager.wallItem && this.entityManager.wallItem.wallRenderer.hasDoorWall) {
                    priority = RoomPriority.getDoorPositionPriority(item.position);
                
                    return priority;
                }
            }

            if(item instanceof RoomFurnitureItem) {
                if(item.furnitureRenderer.placement === "wall") {
                    priority = RoomPriority.WALL_FURNITURE_SPRITE_PRIORITY + RoomRenderer.getPositionPriority(item.position, !item.positionPathData);
                    priority += (item.position.depth * 100);
                }
                else {
                    priority += RoomRenderer.getPositionPriority(item.position, !item.positionPathData);
                }
            }
            else {
                priority += RoomRenderer.getPositionPriority(item.position);

                if(item.type === "figure" && item.positionPathData) {
                    priority += 10;
                }
            }
        }

        return priority;
    }

    public static getPositionPriority(position: RoomPositionData, floored: boolean = true) {
        const row = (floored)?(Math.round(position.row)):(position.row);
        const column = (floored)?(Math.round(position.column)):(position.column);

        return (row * 1000) + (column * 1000) + (position.depth * 10);
    }

    public panToOffset(offset: MousePosition) {
        this.camera.cameraPosition.left = Math.round((this.application.screen.width / 2) + offset.left);
        this.camera.cameraPosition.top = Math.round((this.application.screen.height / 2) + offset.top);
    }

    public isPositionInsideStructure(position: RoomPositionData, dimensions: RoomPositionData) {
        for(let row = position.row; row < position.row + dimensions.row; row++) {
            for(let column = position.column; column < position.column + dimensions.column; column++) {
                if(this.structure.data.grid[row]?.[column] === undefined || this.structure.data.grid[row]?.[column] === 'X') {
                    return false;
                }
            }   
        }

        return true;
    }

    public isPositionInsideFigure(position: RoomPositionData, dimensions: RoomPositionData, ignoreItem?: RoomItem) {
        for(let row = position.row; row < position.row + dimensions.row; row++) {
            for(let column = position.column; column < position.column + dimensions.column; column++) {
                if(this.entityManager.entities.some((item) => (item instanceof RoomFigureItem) && (item.type === "figure" || item.type === "bot") && (!ignoreItem || !(ignoreItem instanceof RoomFigureItem) || item.id !== ignoreItem.id) && item.position?.row === row && item.position.column === column)) {
                    return true;
                }
            }   
        }

        return false;
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

        const extracted = this.application.renderer.extract.canvas({
            target: this.application.stage,
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

    public updatePreviewScale() {
        const furnitureItem = this.entityManager.entities.find(
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

        const canvasWidth = this.application.screen.width;
        const canvasHeight = this.application.screen.height;

        if(canvasWidth <= 0 || canvasHeight <= 0 || furnitureWidth <= 0 || furnitureHeight <= 0) {
            return;
        }

        const padding = 20;
        const scaleX = (canvasWidth - padding) / furnitureWidth;
        const scaleY = (canvasHeight - padding) / furnitureHeight;
        this.previewScale = Math.min(scaleX, scaleY, 1);

        if(furnitureItem.position) {
            const screenPos = this.coordinateMapper.getCoordinatePosition(furnitureItem.position);
            const spriteCenterX = (minX + maxX) / 2;
            const spriteCenterY = (minY + maxY) / 2;

            this.camera.cameraPosition.left = Math.round((this.application.screen.width / 2) + -(screenPos.left + spriteCenterX));
            this.camera.cameraPosition.top = Math.round((this.application.screen.height / 2) + -(screenPos.top + spriteCenterY));
        }
        else {
            this.camera.cameraPosition.left = Math.round((this.application.screen.width / 2));
            this.camera.cameraPosition.top = Math.round((this.application.screen.height / 2));
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

        const filteredItems = this.entityManager.entities.filter((item) => {
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

    public hasLandscapeMask() {
        return this.entityManager.entities.some((item) => item.hasLandscapeMask);
    }
}
