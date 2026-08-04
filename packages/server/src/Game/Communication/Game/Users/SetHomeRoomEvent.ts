import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { SetUserHomeRoomData } from "@pixel63/events";

export default class SetHomeRoomEvent implements ProtobuffListener<SetUserHomeRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: SetUserHomeRoomData) {
        await user.model.update({
            homeRoomId: payload.roomId ?? null
        });

        user.sendUserData();
    }
}
