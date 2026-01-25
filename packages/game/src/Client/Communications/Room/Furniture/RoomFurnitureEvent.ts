import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class RoomFurnitureEvent implements IncomingEvent<WebSocketEvent<RoomFurnitureEventData>> {
    async handle(event: WebSocketEvent<RoomFurnitureEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(event.data.furnitureUpdated?.length) {
            for(let furniture of event.data.furnitureUpdated) {
                clientInstance.roomInstance.value.updateFurniture(furniture);
            }
        }

        if(event.data.furnitureAdded?.length) {
            event.data.furnitureAdded.map((roomFurnitureData) => clientInstance.roomInstance.value!.addFurniture(roomFurnitureData));
        }

        if(event.data.furnitureRemoved?.length) {
            event.data.furnitureRemoved.map((roomFurnitureData) => clientInstance.roomInstance.value!.removeFurniture(roomFurnitureData.id));
        }
    }
}
