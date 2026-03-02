import { clientInstance } from "../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserData } from "@pixel63/events";

export default class UserEvent implements ProtobuffListener<UserData> {
    async handle(payload: UserData) {
        clientInstance.user.value = payload;
    }
}
