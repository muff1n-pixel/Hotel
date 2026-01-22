import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomRenderer from "./Renderer";
import RoomWallItem from "./Items/Map/RoomWallItem";
import FloorRenderer from "./Structure/FloorRenderer";
import WallRenderer from "./Structure/WallRenderer";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import RoomFloorItem from "./Items/Map/RoomFloorItem";

export type RoomFurnitureRendererOptions = {
    withoutWalls?: boolean;
};

export default class RoomFurnitureRenderer {
    private readonly roomRenderer: RoomRenderer;
    private roomItem?: RoomFurnitureItem;
    
    constructor(element: HTMLDivElement, options: RoomFurnitureRendererOptions) {
        const roomStructure: RoomStructure = {
            grid: [
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
                "0000000",
            ],
            floor: {
                id: "101",
                thickness: 8
            },
            wall: {
                id: "2301",
                thickness: 8
            }
        };

        this.roomRenderer = new RoomRenderer(element, undefined, undefined, roomStructure);

        this.roomRenderer.addEventListener("render", () => {
            if(this.roomRenderer && this.roomItem) {
                if(this.roomItem.furnitureRenderer.placement === "floor") {
                    this.roomRenderer.panToItem(this.roomItem, {
                        left: 0,
                        top: (options.withoutWalls)?(-16):(0)
                    });
                }
                else {
                    this.roomRenderer.panToItem(this.roomItem, {
                        left: (Math.max(1, this.roomItem.position!.row) * 16),
                        top: this.roomItem.position!.depth * 32
                    });
                }
            }
        });

        if(!options.withoutWalls) {
            this.roomRenderer.items.push(
                new RoomWallItem(
                    new WallRenderer(roomStructure, roomStructure.wall.id, 64)
                )
            );
        }
    
        this.roomRenderer.items.push(
            new RoomFloorItem(
                new FloorRenderer(roomStructure, roomStructure.floor.id, 64),
            )
        );
    }

    async setFurniture(type: string, size: number, direction: number | undefined = undefined, animation: number = 0, color: number = 0) {
        if(this.roomItem) {
            this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(this.roomItem), 1);
        }

        const furnitureData = await FurnitureAssets.getFurnitureData(type);

        const furnitureRenderer = new FurnitureRenderer(type, size, direction, animation, color);

        await furnitureRenderer.getData();

        this.roomItem = new RoomFurnitureItem(furnitureRenderer, (furnitureData.visualization.placement === "wall") ? (
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

        this.roomRenderer.items.push(this.roomItem);
    }

    progressFurnitureAnimation() {
        if(!this.roomItem) {
            return;
        }

        this.roomItem.furnitureRenderer.animation = this.roomItem.furnitureRenderer.getNextAnimation();
    }

    terminate() {
        this.roomRenderer.terminate();
    }
}