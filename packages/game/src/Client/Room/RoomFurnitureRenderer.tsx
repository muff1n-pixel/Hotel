import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomRenderer from "./Renderer";
import RoomWallItem from "./Items/Map/RoomWallItem";
import FloorRenderer from "./Structure/FloorRenderer";
import WallRenderer from "./Structure/WallRenderer";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import Furniture from "@Client/Furniture/Furniture";
import RoomFloorItem from "./Items/Map/RoomFloorItem";
import FurnitureMultistateLogic from "@Client/Furniture/Logic/FurnitureMultistateLogic";
import { clientInstance } from "../..";

export type RoomFurnitureRendererOptions = {
    withoutWalls?: boolean;
};

export default class RoomFurnitureRenderer {
    private readonly roomRenderer: RoomRenderer;
    private roomItem?: RoomFurnitureItem;

    private wallRenderer: WallRenderer;
    private wallItem: RoomWallItem;

    private floorRenderer: FloorRenderer;
    private floorItem: RoomFloorItem;
    
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

        this.wallRenderer = new WallRenderer(roomStructure, roomStructure.wall.id, 64);
        this.wallItem = new RoomWallItem(this.roomRenderer, this.wallRenderer);

        if(!options.withoutWalls) {
            this.roomRenderer.items.push(this.wallItem);
        }

        this.floorRenderer = new FloorRenderer(roomStructure, roomStructure.floor.id, 64);
        this.floorItem = new RoomFloorItem(this.roomRenderer, this.floorRenderer);
    
        this.roomRenderer.items.push(this.floorItem);
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

        this.roomRenderer.items.push(this.roomItem);
    }

    progressFurnitureAnimation() {
        if(!this.roomItem) {
            return;
        }

        const logic = this.roomItem.furnitureRenderer.getLogic();

        if(logic instanceof FurnitureMultistateLogic) {
            this.roomItem.furnitureRenderer.animation = logic.getNextState();
        }
    }

    terminate() {
        this.roomRenderer.terminate();
    }
}