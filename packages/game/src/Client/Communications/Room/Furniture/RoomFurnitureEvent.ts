import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class RoomFurnitureEvent implements IncomingEvent<WebSocketEvent<RoomFurnitureEventData>> {
    async handle(event: WebSocketEvent<RoomFurnitureEventData>) {
        if(!clientInstance.roomInstance) {
            throw new Error("Room instance is not created.");
        }

        if(event.data.furnitureUpdated?.length) {
            for(let furniture of event.data.furnitureUpdated) {
                clientInstance.roomInstance.updateFurniture(furniture);
            }
        }

        if(event.data.furnitureAdded?.length) {
            event.data.furnitureAdded.map((roomFurnitureData) => clientInstance.roomInstance!.addFurniture(roomFurnitureData));
        }

        if(event.data.furnitureRemoved?.length) {
            event.data.furnitureRemoved.map((roomFurnitureData) => clientInstance.roomInstance!.removeFurniture(roomFurnitureData.id));
        }
    }
}
