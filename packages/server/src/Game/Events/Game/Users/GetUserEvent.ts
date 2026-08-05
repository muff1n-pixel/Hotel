import User from "../../../Users/User.js";
import IncomingEvent from "../../../Communication/Interfaces/IncomingEvent.js";
import { GetUserData, UserData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class GetUserEvent implements UserProtobuffListener<GetUserData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User) {
        user.sendUserData();
    }
}
