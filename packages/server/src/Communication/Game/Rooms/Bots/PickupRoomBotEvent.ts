import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PickupRoomBotData } from "@pixel63/events";

export default class PickupRoomBotEvent implements ProtobuffListener<PickupRoomBotData> {
    async handle(user: User, payload: PickupRoomBotData) {
        if(!user.room) {
            return;
        }

        const userBot = user.room.getBot(payload.id);

        if(userBot.model.user.id !== user.model.id) {
            throw new Error("User is not owner of the bot.");
        }

        await userBot.pickup();
    }
}
