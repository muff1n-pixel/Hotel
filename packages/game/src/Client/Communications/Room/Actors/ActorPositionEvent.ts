import IncomingEvent from "@Client/Communications/IncomingEvent";
import { ActorPositionEventData } from "@Shared/Communications/Responses/Rooms/Actors/ActorPositionEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";

export default class ActorPositionEvent implements IncomingEvent<WebSocketEvent<ActorPositionEventData>> {
    async handle(event: WebSocketEvent<ActorPositionEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const actor = clientInstance.roomInstance.value.getActor(event.data);

        if(event.data.usePath) {
            actor.item.setPositionPath(actor.item.position!, event.data.position, 0, false);
        }
        else {
            actor.item.finishPositionPath();

            actor.item.setPosition(event.data.position);
        }

        if(event.data.direction !== undefined) {
            actor.item.figureRenderer.direction = event.data.direction;
        }
    }
}
