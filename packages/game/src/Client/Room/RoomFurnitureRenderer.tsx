import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomRenderer from "./Renderer";
import RoomWallItem from "./Items/Map/RoomWallItem";
import FloorRenderer from "./Structure/FloorRenderer";
import WallRenderer from "./Structure/WallRenderer";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import Furniture from "@Client/Furniture/Furniture";
import RoomFloorItem from "./Items/Map/RoomFloorItem";
import { clientInstance } from "../..";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import Figure from "@Client/Figure/Figure";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";

export type RoomFurnitureRendererOptions = {
    rows?: number;
    columns?: number;

    withoutWalls?: boolean;
};

export default class RoomFurnitureRenderer {
    private readonly roomRenderer: RoomRenderer;
    private roomItem?: RoomFurnitureItem | RoomFigureItem;

    private wallRenderer: WallRenderer;
    private wallItem: RoomWallItem;

    private floorRenderer: FloorRenderer;
    private floorItem: RoomFloorItem;
    
    constructor(element: HTMLDivElement, options: RoomFurnitureRendererOptions) {
        const roomStructure: RoomStructure = {
            grid: new Array(options.rows ?? 7).fill(null).map((_) => new Array(options.columns ?? 7).fill(null).map(() => '0').join('')),
            floor: {
                id: clientInstance.roomInstance.value?.roomRenderer.structure.floor.id ?? "111",
                thickness: 8
            },
            wall: {
                id: clientInstance.roomInstance.value?.roomRenderer.structure.wall.id ?? "201",
                thickness: 8,
                hidden: false
            }
        };

        this.roomRenderer = new RoomRenderer(element, undefined, undefined, roomStructure);

        this.roomRenderer.addEventListener("render", () => {
            if(this.roomRenderer && this.roomItem && (this.roomItem instanceof RoomFurnitureItem)) {
                if(this.roomItem.furnitureRenderer.placement === "floor") {
                    this.roomRenderer.panToItem(this.roomItem, {
                        left: 0,
                        top: (options.withoutWalls)?(-16):(0)
                    });
                }
                else {
                    this.roomRenderer.panToItem(this.roomItem, {
                        left: (Math.max(1, this.roomItem.position?.row ?? 0) * 16),
                        top: (this.roomItem.position?.depth ?? 0) * 32
                    });
                }
            }
        });

        this.wallRenderer = new WallRenderer(roomStructure, roomStructure.wall.id, 64);
        this.wallItem = new RoomWallItem(this.roomRenderer, this.wallRenderer);

        if(!options.withoutWalls) {
            this.roomRenderer.items.push(this.wallItem);
        }

        this.floorRenderer = new FloorRenderer(roomStructure, roomStructure.floor.id, 64);
        this.floorItem = new RoomFloorItem(this.roomRenderer, this.floorRenderer);
    
        this.roomRenderer.items.push(this.floorItem);
    }

    async setFigure(figureConfiguration: FigureConfiguration, actions?: string[], position?: RoomPosition) {
        if(this.roomItem) {
            this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(this.roomItem), 1);
        }

        const figureRenderer = new Figure(figureConfiguration, 2, actions);
        
        this.roomItem = new RoomFigureItem(this.roomRenderer, figureRenderer, {
            row: position?.row ?? 1,
            column: position?.column ?? 1,
            depth: position?.depth ?? 0
        });
        
        this.roomRenderer.items.push(this.roomItem);

        this.roomRenderer.panToItem(this.roomItem, { left: 0, top: 64 });
    }

    async setFurniture(type: string, size: number, direction: number | undefined = undefined, animation: number = 0, color: number = 0) {
        if(this.roomItem) {
            this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(this.roomItem), 1);
        }

        if(type === "wallpaper") {
            this.wallRenderer.wallId = color.toString();
            this.wallItem.render();

            return;
        }

        if(type === "floor") {
            this.floorRenderer.floorId = color.toString();
            this.floorItem.render();

            return;
        }

        const furnitureData = await FurnitureAssets.getFurnitureData(type);

        const furnitureRenderer = new Furniture(type, size, (furnitureData.visualization.placement === "wall")?(2):(direction), animation, color);

        await furnitureRenderer.getData();

        this.roomItem = new RoomFurnitureItem(this.roomRenderer, furnitureRenderer, (furnitureData.visualization.placement === "wall") ? (
            {
                row: 1 + Math.max(1, furnitureRenderer.getDimensions(true).row),
                column: 0,
                depth: 1.5
            }
        ):(
            {
                row: 1,
                column: 1,
                depth: 0
            }
        )
        );

        this.roomItem.priority = 10000000;

        this.roomRenderer.items.push(this.roomItem);
    }

    progressFurnitureAnimation() {
        if(!this.roomItem) {
            return;
        }

        if(this.roomItem instanceof RoomFurnitureItem) {
            this.roomItem.furnitureRenderer.animation = this.getNextState();
        }
    }
    

    private getNextState() {
        if(!this.roomItem) {
            return 0;
        }
        
        if(!(this.roomItem instanceof RoomFurnitureItem)) {
            return 0;
        }

        if(!this.roomItem.furnitureRenderer.data) {
            return this.roomItem.furnitureRenderer.animation;
        }

        const visualization = this.roomItem?.furnitureRenderer.getVisualizationData(this.roomItem?.furnitureRenderer.data);

        const currentAnimationIndex = visualization.animations.findIndex((animation) => animation.id === (this.roomItem as RoomFurnitureItem)?.furnitureRenderer.animation);

        if(currentAnimationIndex === -1) {
            return visualization.animations[0]?.id ?? 0;
        }

        if(!visualization.animations[currentAnimationIndex + 1]) {
            return 0;
        }

        return visualization.animations[currentAnimationIndex + 1].id;
    }

    terminate() {
        this.roomRenderer.terminate();
    }
}