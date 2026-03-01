import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomUserData } from "@pixel63/events";

export default class RoomUserEvent implements ProtobuffListener<RoomUserData> {
    async handle(payload: RoomUserData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const roomUser = clientInstance.roomInstance.value.getUserById(payload.id);

        if(payload.hasRights !== undefined) {
            roomUser.data.hasRights = payload.hasRights;

            if(clientInstance.user.value?.id === payload.id) {
                clientInstance.roomInstance.value.hasRights = payload.hasRights;
            }
        }

        if(payload.figureConfiguration !== undefined) {
            roomUser.data.figureConfiguration = payload.figureConfiguration;
            roomUser.item.figureRenderer.configuration = payload.figureConfiguration;
        }

        if(payload.typing !== undefined) {
            roomUser.item.typing = payload.typing;
        }

        if(payload.idling !== undefined) {
            if(payload.idling) {
                roomUser.item.figureRenderer.addAction("Sleep");
            }
            else {
                roomUser.item.figureRenderer.removeAction("Sleep");
            }

            roomUser.item.idling = payload.idling;
        }

        if(payload.actions !== undefined) {
            roomUser.item.figureRenderer.setActions(payload.actions);
        }

        clientInstance.roomInstance.update();
    }
}
