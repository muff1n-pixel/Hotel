import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { SetUserHomeRoomData } from "@pixel63/events";

export default class SetHomeRoomEvent implements UserProtobuffListener<SetUserHomeRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: SetUserHomeRoomData) {
        await user.model.update({
            homeRoomId: payload.roomId ?? null
        });

        user.sendUserData();
    }
}
