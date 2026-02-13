import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomInformationEventData } from "@Shared/Communications/Responses/Rooms/RoomInformationEventData";
import { clientInstance } from "../../..";
    import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class RoomInformationEvent implements IncomingEvent<WebSocketEvent<RoomInformationEventData>> {
    async handle(event: WebSocketEvent<RoomInformationEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        clientInstance.roomInstance.value.information = event.data.information;
        clientInstance.roomInstance.update();
    }
}
