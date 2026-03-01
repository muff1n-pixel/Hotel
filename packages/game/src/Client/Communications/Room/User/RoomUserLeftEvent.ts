import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomUserLeftData } from "@pixel63/events";

export default class RoomUserLeftEvent implements ProtobuffListener<RoomUserLeftData> {
    async handle(payload: RoomUserLeftData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        clientInstance.roomInstance.value.removeUser(payload.userId);
    }
}
