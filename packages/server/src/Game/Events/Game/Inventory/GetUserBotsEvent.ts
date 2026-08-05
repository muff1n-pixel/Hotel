import { GetUserInventoryBotsData } from "@pixel63/events";
import User from "../../../Users/User.js";
import IncomingEvent from "../../../Communication/Interfaces/IncomingEvent.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class GetUserBotsEvent implements UserProtobuffListener<GetUserInventoryBotsData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User): Promise<void> {
        await user.getInventory().sendBots();
    }
}
