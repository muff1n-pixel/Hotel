import { SetUserRoomChatStyleData } from "@pixel63/events";
import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class SetRoomChatStyleEvent implements ProtobuffListener<SetUserRoomChatStyleData> {
    public readonly name = "SetRoomChatStyleEvent";

    async handle(user: User, payload: SetUserRoomChatStyleData) {
        user.model.roomChatStyleId = payload.id;

        await user.model.save();
    }
}
