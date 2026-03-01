import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomUserEnteredData } from "@pixel63/events";

export default class RoomUserEnteredEvent implements ProtobuffListener<RoomUserEnteredData> {
    async handle(payload: RoomUserEnteredData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(!payload.user) {
            throw new Error();
        }

        clientInstance.roomInstance.value.users.push(clientInstance.roomInstance.value.addUser(payload.user));
    }
}
