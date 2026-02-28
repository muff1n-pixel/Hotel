import { clientInstance } from "../../../..";
import { UserData } from "@pixel63/events";
import IncomingProtobuffer from "@Client/Communications/IncomingProtobuffer";

export default class UserEvent implements IncomingProtobuffer<UserData> {
    public readonly name = "UserData";
    
    async handle(payload: UserData) {
        clientInstance.user.value = payload;
    }
}
