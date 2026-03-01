import { GetUserInventoryBadgesData } from "@pixel63/events";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class GetInventoryBadgesEvent implements ProtobuffListener<GetUserInventoryBadgesData> {
    public readonly name = "GetInventoryBadgesEvent";

    async handle(user: User): Promise<void> {
        await user.getInventory().sendBadges();
    }
}
