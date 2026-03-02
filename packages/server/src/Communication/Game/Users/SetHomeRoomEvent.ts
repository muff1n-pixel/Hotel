import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { SetUserHomeRoomData } from "@pixel63/events";

export default class SetHomeRoomEvent implements ProtobuffListener<SetUserHomeRoomData> {
    public readonly name = "SetHomeRoomEvent";

    async handle(user: User, payload: SetUserHomeRoomData) {
        user.model.homeRoomId = payload.roomId;

        await user.model.save();

        user.sendUserData();
    }
}
