import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { RoomActorActionData } from "@pixel63/events";

export default class RoomActorActionEvent implements ProtobuffListener<RoomActorActionData> {
    async handle(payload: RoomActorActionData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        const actor = clientInstance.roomInstance.value.getActor(payload.actor);

        if(actor.item instanceof RoomFigureItem) {
            if(payload.actionsAdded.length) {
                for(const action of payload.actionsAdded) {
                    actor.item.figureRenderer.addAction(action);

                    if(action === "Snowboard360") {
                        actor.item.frame = 10;
                    }
                }
            }

            if(payload.actionsRemoved.length) {
                for(const action of payload.actionsRemoved) {
                    actor.item.figureRenderer.removeAction(action);
                }
            }

            clientInstance.roomInstance.value.roomRenderer.focusedItem.update();
        }
    }
}
