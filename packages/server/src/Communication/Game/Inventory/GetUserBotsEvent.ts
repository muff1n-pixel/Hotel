import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";

export default class GetUserBotsEvent implements IncomingEvent {
    public readonly name = "GetUserBotsEvent";

    async handle(user: User, event: null): Promise<void> {
        await user.getInventory().sendBots();
    }
}
