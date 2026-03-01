import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomActorChatData } from "@pixel63/events";

export default class RoomActorChatEvent implements ProtobuffListener<RoomActorChatData> {
    async handle(payload: RoomActorChatData) {
        const actor = clientInstance.roomInstance.value?.getActor(payload.actor);

        if(actor) {
            actor.item.typing = false;

            if(!payload.options?.hideUsername) {
                actor.item.figureRenderer.addAction("Talk");

                setTimeout(() => {
                    actor.item.figureRenderer.removeAction("Talk");
                }, Math.max(800, payload.message.length * 60));
            }
        }
    }
}
