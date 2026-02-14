import IncomingEvent from "@Client/Communications/IncomingEvent";
import { UserPositionEventData } from "@Shared/Communications/Responses/Rooms/Users/UserPositionEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class UserPositionEvent implements IncomingEvent<WebSocketEvent<UserPositionEventData>> {
    async handle(event: WebSocketEvent<UserPositionEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const roomUser = clientInstance.roomInstance.value.getUserById(event.data.userId);

        if(event.data.usePath) {
            roomUser.item.setPositionPath(roomUser.item.position!, event.data.position, 0, false);
        }
        else {
            roomUser.item.setPosition(event.data.position);
        }
    }
}
