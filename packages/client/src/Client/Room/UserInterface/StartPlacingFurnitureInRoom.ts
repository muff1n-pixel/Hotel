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
import StartPlacingFurnitureInRoom, { PlaceFurnitureInRoomProperties } from "@Shared/Events/Room/Cursor/StartPlacingFurnitureInRoom";
import RoomClickEvent from "@Client/Events/RoomClickEvent";

export default function registerRoomInventoryEvents(clientInstance: ClientInstance) {
    clientInstance.internalEventTarget.addEventListener<StartPlacingFurnitureInRoom>("StartPlacingFurnitureInRoom", (event) => {
        if(!clientInstance.roomInstance) {
            return;
        }

        console.log(event);

        clientInstance.roomInstance.roomRenderer.cursor!.cursorDisabled = true;

        const furnitureRenderer = new FurnitureRenderer(event.furnitureData.type, 64, undefined, 0, event.furnitureData.color);
        
        const roomFurnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 0,
            column: 0,
            depth: 0
        });

        const renderListener = () => {
            const entity = clientInstance.roomInstance!.roomRenderer.getItemAtPosition((item) => item.type === "map");

            if(!entity) {
                const index = clientInstance.roomInstance!.roomRenderer.items.indexOf(roomFurnitureItem);

                if(index !== -1) {
                    clientInstance.roomInstance!.roomRenderer.items.splice(clientInstance.roomInstance!.roomRenderer.items.indexOf(roomFurnitureItem), 1);
                }

                return;
            }

            const index = clientInstance.roomInstance!.roomRenderer.items.indexOf(roomFurnitureItem);

            if(index === -1) {
                clientInstance.roomInstance!.roomRenderer.items.push(roomFurnitureItem);
            }

            roomFurnitureItem.setPosition(entity.position);
        };

        clientInstance.roomInstance.roomRenderer.addEventListener("render", renderListener);

        const clickListener = (clickEvent: Event) => {
            if(!(clickEvent instanceof RoomClickEvent)) {
                return;
            }

            if(clickEvent.floorEntity) {
                event.options.onPlace(properties, clickEvent.floorEntity.position);
            }
            else {
                event.options.onCancel(properties);
            }
        };

        clientInstance.roomInstance.roomRenderer.cursor?.addEventListener("click", clickListener);

        const properties: PlaceFurnitureInRoomProperties = {
            terminate: () => {
                clientInstance.roomInstance!.roomRenderer.removeEventListener("render", renderListener);
                clientInstance.roomInstance!.roomRenderer.removeEventListener("click", clickListener);

                const index = clientInstance.roomInstance!.roomRenderer.items.indexOf(roomFurnitureItem);

                if(index !== -1) {
                    clientInstance.roomInstance!.roomRenderer.items.splice(clientInstance.roomInstance!.roomRenderer.items.indexOf(roomFurnitureItem), 1);
                }
                
                clientInstance.roomInstance!.roomRenderer.cursor!.cursorDisabled = false;                
            }
        };

        //event.resolve(properties);
    });
}
