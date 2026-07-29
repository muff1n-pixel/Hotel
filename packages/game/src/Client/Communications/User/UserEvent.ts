import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserData } from "@pixel63/events";

export default class UserEvent implements ProtobuffListener<UserData> {
    async handle(payload: UserData) {
        clientInstance.user.value = payload;

        if(clientInstance.roomInstance.value) {
            clientInstance.roomInstance.value.isOwner = clientInstance.roomInstance.value.information?.owner?.id === clientInstance.user.value?.id;
        }
    }
}
