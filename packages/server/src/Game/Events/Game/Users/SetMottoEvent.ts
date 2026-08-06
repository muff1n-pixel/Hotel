import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { RoomUserData, SetUserMottoData } from "@pixel63/events";

export default class SetMottoEvent implements UserProtobuffListener<SetUserMottoData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: SetUserMottoData) {
        user.model.motto = payload.motto;

        if(user.model.changed()) {
            await user.save();
        }
    }
}
