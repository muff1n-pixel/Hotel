import IncomingEvent from "@Client/Communications/IncomingEvent";
import { UserIdlingEventData } from "@Shared/Communications/Responses/Rooms/Users/UserIdlingEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { clientInstance } from "../../../..";

export default class UserIdlingEvent implements IncomingEvent<WebSocketEvent<UserIdlingEventData>> {
    async handle(event: WebSocketEvent<UserIdlingEventData>) {
        const roomUser = clientInstance.roomInstance.value?.getUserById(event.data.userId);

        if(roomUser) {
            if(event.data.idling) {
                roomUser.item.figureRenderer.addAction("Sleep");
            }
            else {
                roomUser.item.figureRenderer.removeAction("Sleep");
            }

            roomUser.item.idling = event.data.idling;
        }
    }
}
