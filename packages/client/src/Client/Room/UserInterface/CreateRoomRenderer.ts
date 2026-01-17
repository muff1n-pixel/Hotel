import ClientInstance from "@Client/ClientInstance";
import CreateRoomRendererEvent from "@Shared/Events/Room/Renderer/CreateRoomRendererEvent";
import RoomRenderer from "../Renderer";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import RoomMapItem from "../Items/Map/RoomFurnitureItem";
import FloorRenderer from "../Structure/FloorRenderer";
import WallRenderer from "../Structure/WallRenderer";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";

export default function registerUserInterfaceRoomRenderer(clientInstance: ClientInstance) {
    clientInstance.internalEventTarget.addEventListener<CreateRoomRendererEvent>("CreateRoomRendererEvent", (event) => {
        const roomRenderer = new RoomRenderer(event.element, clientInstance);
        let roomItem: RoomFurnitureItem | undefined = undefined;

        roomRenderer.addEventListener("render", () => {
            if(roomRenderer && roomItem) {
                roomRenderer.panToItem(roomItem, {
                    left: 0,
                    top: (event.options.withoutWalls)?(-16):(0)
                });
            }
        });

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
    
        roomRenderer.items.push(new RoomMapItem(
            new FloorRenderer(roomStructure, roomStructure.floor.id, 64),
            (!event.options.withoutWalls)?(new WallRenderer(roomStructure, roomStructure.wall.id, 64)):(undefined)
        ));

        event.resolve({
            terminate: () => {
                roomRenderer.terminate();
            },
            setFurniture: async (type: string, size: number, direction: number | undefined = undefined, animation: number = 0, color: number = 0) => {
                if(roomItem) {
                    roomRenderer.items.splice(roomRenderer.items.indexOf(roomItem), 1);
                }

                const furnitureData = await FurnitureAssets.getFurnitureData(type);

                const furnitureRenderer = new FurnitureRenderer(type, size, direction, animation, color);

                roomItem = new RoomFurnitureItem(furnitureRenderer, (furnitureData.visualization.placement === "wall") ? (
                    {
                        row: 1,
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

                roomRenderer.items.push(roomItem);
            },
            progressFurnitureAnimation: () => {
                if(!roomItem) {
                    return;
                }

                roomItem.furnitureRenderer.animation = roomItem.furnitureRenderer.getNextAnimation();
            }
        });
    });
}
