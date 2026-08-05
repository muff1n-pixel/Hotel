import { RoomUserData, SetRoomChatTypingData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser";

export default class SetTypingEvent implements RoomProtobuffListener<SetRoomChatTypingData> {
    async handle(user: RoomWebSocketUser, payload: SetRoomChatTypingData) {
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
