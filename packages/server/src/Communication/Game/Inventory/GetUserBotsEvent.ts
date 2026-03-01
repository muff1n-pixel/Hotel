import { GetUserInventoryBotsData } from "@pixel63/events";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetUserBotsEvent implements ProtobuffListener<GetUserInventoryBotsData> {
    public readonly name = "GetUserBotsEvent";

    async handle(user: User): Promise<void> {
        await user.getInventory().sendBots();
    }
}
