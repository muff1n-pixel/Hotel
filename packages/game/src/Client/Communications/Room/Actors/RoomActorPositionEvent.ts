import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomActorPositionData } from "@pixel63/events";

export default class RoomActorPositionEvent implements ProtobuffListener<RoomActorPositionData> {
    async handle(payload: RoomActorPositionData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const actor = clientInstance.roomInstance.value.getActor(payload.actor);

        if(!payload.position) {
            return;
        }

        if(payload.usePath) {
            actor.item.setPositionPath(actor.item.position!, payload.position, 0, false);
        }
        else {
            actor.item.finishPositionPath();

            actor.item.setPosition(payload.position);
        }

        if(payload.direction !== undefined) {
            actor.item.figureRenderer.direction = payload.direction;
        }
    }
}
