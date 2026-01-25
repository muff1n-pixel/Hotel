import IncomingEvent from "@Client/Communications/IncomingEvent";
import { UserActionEventData } from "@Shared/Communications/Responses/Rooms/Users/UserActionEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class UserActionEvent implements IncomingEvent<WebSocketEvent<UserActionEventData>> {
    async handle(event: WebSocketEvent<UserActionEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const roomUser = clientInstance.roomInstance.value.getUserById(event.data.userId);

        if(event.data.actionsAdded) {
            for(let action of event.data.actionsAdded) {
                roomUser.item.figureRenderer.addAction(action);
            }
        }

        if(event.data.actionsRemoved) {
            for(let action of event.data.actionsRemoved) {
                roomUser.item.figureRenderer.removeAction(action);
            }
        }
    }
}
