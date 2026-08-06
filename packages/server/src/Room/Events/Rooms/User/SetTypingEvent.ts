import { RoomUserData, SetRoomChatTypingData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";

export default class SetTypingEvent implements RoomProtobuffListener<SetRoomChatTypingData> {
    async handle(user: User, payload: SetRoomChatTypingData) {
        if(user.roomUser.typing === payload.typing) {
            return;
        }

        user.roomUser.typing = payload.typing === true;

        user.roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
            id: user.id,
            typing: user.roomUser.typing
        }));
    }
}
