import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomStructureEventData } from "@Shared/Communications/Responses/Rooms/RoomStructureEventData";
import { clientInstance } from "../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class RoomStructureEvent implements IncomingEvent<WebSocketEvent<RoomStructureEventData>> {
    async handle(event: WebSocketEvent<RoomStructureEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        clientInstance.roomInstance.value.setStructure(event.data.structure);
    }
}
