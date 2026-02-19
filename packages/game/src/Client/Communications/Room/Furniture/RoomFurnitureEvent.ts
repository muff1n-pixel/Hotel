import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export default class RoomFurnitureEvent implements IncomingEvent<WebSocketEvent<RoomFurnitureEventData>> {
    async handle(event: WebSocketEvent<RoomFurnitureEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(event.data.furnitureUpdated?.length) {
            for(const furniture of event.data.furnitureUpdated) {
                const roomFurnitureItem = clientInstance.roomInstance.value.getFurnitureById(furniture.id);

                roomFurnitureItem.updateData(furniture);
            }
        }

        if(event.data.furnitureAdded?.length) {
            clientInstance.roomInstance.value.furnitures.push(...event.data.furnitureAdded.map((roomFurnitureData) => new RoomFurniture(clientInstance.roomInstance.value!, roomFurnitureData)));
        }

        if(event.data.furnitureRemoved?.length) {
            event.data.furnitureRemoved.map((roomFurnitureData) => clientInstance.roomInstance.value!.removeFurniture(roomFurnitureData.id));
        }

        clientInstance.roomInstance.update();
    }
}
