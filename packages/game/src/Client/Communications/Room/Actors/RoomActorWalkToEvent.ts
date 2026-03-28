import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import { RoomActorWalkToData } from "@pixel63/events";

export default class RoomActorWalkToEvent implements ProtobuffListener<RoomActorWalkToData> {
    async handle(payload: RoomActorWalkToData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        const actor = clientInstance.roomInstance.value.getActor(payload.actor);

        if(!payload.from || !payload.to) {
            throw new Error("Validation error.");
        }

        if(payload.jump) {
            actor.item.setPositionPath(payload.from, [
                {
                    "$type": "RoomPositionData",
                    row: payload.from.row + ((payload.to.row - payload.from.row) / 2),
                    column: payload.from.column + ((payload.to.column - payload.from.column) / 2),
                    depth: payload.to.depth + 0.25
                },
                payload.to
            ], 250);
        }
        else {
            actor.item.setPositionPath(payload.from, payload.to);
        }
        
        if(actor.item instanceof RoomFigureItem) {
            actor.item.figureRenderer.direction = payload.direction;
        }
        else if(actor.item instanceof RoomPetItem) {
            actor.item.pet.direction = payload.direction;
        }
    }
}
