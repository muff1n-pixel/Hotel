import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { GetUserData, UserData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetUserEvent implements ProtobuffListener<GetUserData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User) {
        user.sendUserData();
    }
}
