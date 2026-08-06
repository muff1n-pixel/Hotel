import { PickupRoomBotData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";

export default class PickupRoomBotEvent implements RoomProtobuffListener<PickupRoomBotData> {
    async handle(user: User, payload: PickupRoomBotData) {
        const userBot = user.roomUser.room.getBot(payload.id);

        if(userBot.model.user.id !== user.id) {
            throw new Error("User is not owner of the bot.");
        }

        await userBot.pickup();
    }
}
