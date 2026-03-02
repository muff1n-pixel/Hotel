import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
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

        actor.item.setPositionPath(payload.from, payload.to);
    }
}
