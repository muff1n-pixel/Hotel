import IncomingEvent from "@Client/Communications/IncomingEvent";
import { MoveRoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/MoveRoomFurnitureEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class MoveRoomFurnitureEvent implements IncomingEvent<WebSocketEvent<MoveRoomFurnitureEventData>> {
    async handle(event: WebSocketEvent<MoveRoomFurnitureEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        const roomFurnitureItem = clientInstance.roomInstance.value.getFurnitureById(event.data.id);

        roomFurnitureItem.item.setPositionPath(roomFurnitureItem.item.position!, event.data.position);
    }
}
