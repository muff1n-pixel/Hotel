import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { RoomActorPositionData } from "@pixel63/events";

export default class RoomActorPositionEvent implements ProtobuffListener<RoomActorPositionData> {
    async handle(payload: RoomActorPositionData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const actor = clientInstance.roomInstance.value.getActor(payload.actor);

        if(payload.direction !== undefined) {
            if(actor.item instanceof RoomFigureItem) {
                actor.item.figureRenderer.direction = payload.direction;
            }
            else {
                actor.item.pet.direction = payload.direction;
            }
        }

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
    }
}
