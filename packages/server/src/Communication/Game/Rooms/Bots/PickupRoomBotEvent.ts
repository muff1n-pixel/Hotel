import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { PickupRoomBotEventData } from "@shared/Communications/Requests/Rooms/Bots/PickupRoomBotEventData.js";

export default class PickupRoomBotEvent implements IncomingEvent<PickupRoomBotEventData> {
    public readonly name = "PickupRoomBotEvent";

    async handle(user: User, event: PickupRoomBotEventData) {
        if(!user.room) {
            return;
        }

        const userBot = user.room.getBot(event.userBotId);

        if(userBot.model.user.id !== user.model.id) {
            throw new Error("User is not owner of the bot.");
        }

        await userBot.pickup();
    }
}
