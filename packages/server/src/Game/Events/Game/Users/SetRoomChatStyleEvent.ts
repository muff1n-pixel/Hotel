import { SetUserRoomChatStyleData } from "@pixel63/events";
import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class SetRoomChatStyleEvent implements UserProtobuffListener<SetUserRoomChatStyleData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: SetUserRoomChatStyleData) {
        user.model.roomChatStyleId = payload.id;

        await user.save();
    }
}
