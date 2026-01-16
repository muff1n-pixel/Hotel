import ClientInstance from "@/ClientInstance.js";
import StartRoomRenderer from "@shared/Events/Room/Renderer/StartRoomRenderer.js";
import SetRoomRendererFurniture from "@shared/Events/Room/Renderer/SetRoomRendererFurniture.js";
import RoomRendererStarted from "@shared/Events/Room/Renderer/RoomRendererStarted.js";
import RoomRenderer from "../Renderer.js";
import { RoomStructure } from "@shared/Interfaces/Room/RoomStructure.js";
import RoomMapItem from "../Items/Map/RoomFurnitureItem.js";
import FloorRenderer from "../Structure/FloorRenderer.js";
import WallRenderer from "../Structure/WallRenderer.js";
import RoomItem from "../Items/RoomItem.js";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem.js";
import FurnitureRenderer from "@/Furniture/FurnitureRenderer.js";
import TerminateRoomRenderer from "@shared/Events/Room/Renderer/TerminateRoomRenderer.js";
import FurnitureAssets from "@/Assets/FurnitureAssets.js";

export default function registerRoomUserInterfaceEvents(clientInstance: ClientInstance) {
    let roomRenderer: RoomRenderer | undefined = undefined;
    let roomItem: RoomItem | undefined = undefined;

    clientInstance.internalEventTarget.addEventListener<StartRoomRenderer>("StartRoomRenderer", (event) => {
        if(roomRenderer) {
            roomRenderer.terminate();
        }

        roomRenderer = new RoomRenderer(event.element, clientInstance);

        roomRenderer.addEventListener("render", () => {
            if(roomRenderer && roomItem) {
                roomRenderer.panToItem(roomItem);
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
            new WallRenderer(roomStructure, roomStructure.wall.id, 64)
        ));

        clientInstance.internalEventTarget.dispatchEvent(new RoomRendererStarted(event.id));
    });

    clientInstance.internalEventTarget.addEventListener<SetRoomRendererFurniture>("SetRoomRendererFurniture", async (event) => {
        if(!roomRenderer) {
            return;
        }

        if(roomItem) {
            roomRenderer.items.splice(roomRenderer.items.indexOf(roomItem), 1);
        }

        const furnitureData = await FurnitureAssets.getFurnitureData(event.type);

        const furnitureRenderer = new FurnitureRenderer(event.type, event.size, event.direction, event.animation, event.color);


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
    });

    clientInstance.internalEventTarget.addEventListener<TerminateRoomRenderer>("TerminateRoomRenderer", (event) => {
        if(!roomRenderer) {
            return;
        }

        roomRenderer.terminate();;

        roomItem = undefined;
        roomRenderer = undefined;
    });
}
