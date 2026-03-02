import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { EnterRoomData } from "@pixel63/events";

export default class EnterRoomEvent implements ProtobuffListener<EnterRoomData> {
    public readonly name = "EnterRoomEvent";

    async handle(user: User, payload: EnterRoomData) {
        if(user.room) {
            const roomUser = user.room.getRoomUser(user);

            roomUser.disconnect();
        }
        
        const roomInstance = await game.roomManager.getOrLoadRoomInstance(payload.id);

        if(!roomInstance) {
            console.error("Room does not exist.");

            return;
        }

        roomInstance.addUserClient(user);
    }
}
