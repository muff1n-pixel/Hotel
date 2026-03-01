import User from "../../../../Users/User.js";
import { RoomUserData, SetRoomChatTypingData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class SetTypingEvent implements ProtobuffListener<SetRoomChatTypingData> {
    async handle(user: User, payload: SetRoomChatTypingData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.typing === payload.typing) {
            return;
        }

        roomUser.typing = payload.typing === true;

        user.room.sendProtobuff(RoomUserData, RoomUserData.create({
            id: user.model.id,
            typing: roomUser.typing
        }));
    }
}
