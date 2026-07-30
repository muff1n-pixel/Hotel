import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import SoundsManager from "@Game/Sounds/SoundsManager";
import { UserData } from "@pixel63/events";

export default class UserEvent implements ProtobuffListener<UserData> {
    async handle(payload: UserData) {
        if(clientInstance.user.value) {
            if(
                (clientInstance.user.value.credits > payload.credits)
                || (clientInstance.user.value.duckets > payload.duckets)
                || (clientInstance.user.value.diamonds > payload.diamonds)
            ) {
                SoundsManager.playSound(SoundsManager.SOUND_CATALOGUE_CASH);
            }
        }

        clientInstance.user.value = payload;

        if(clientInstance.roomInstance.value) {
            clientInstance.roomInstance.value.isOwner = clientInstance.roomInstance.value.information?.owner?.id === clientInstance.user.value?.id;
        }
    }
}
