import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomUserData } from "@pixel63/events";

export default class RoomUserEvent implements ProtobuffListener<RoomUserData> {
    async handle(payload: RoomUserData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }
        
        const roomUser = clientInstance.roomInstance.value.getUserById(payload.id);

        roomUser.updateData(payload);

        clientInstance.roomInstance.update();
    }
}
