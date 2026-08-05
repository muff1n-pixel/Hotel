import { PingData } from "@pixel63/events";
import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class PingEvent implements UserProtobuffListener<PingData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User) {
        user.sendProtobuff(PingData, PingData.create({}));
    }
}
