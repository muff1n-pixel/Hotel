import IncomingEvent from "../../../../Game/Communication/Interfaces/IncomingEvent.js";
import User from "../../../../Game/Users/User.js";
import { PickupRoomBotData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";

export default class PickupRoomBotEvent implements RoomProtobuffListener<PickupRoomBotData> {
    async handle(user: RoomWebSocketUser, payload: PickupRoomBotData) {
        const userBot = user.roomUser.room.getBot(payload.id);

        if(userBot.model.user.id !== user.id) {
            throw new Error("User is not owner of the bot.");
        }

        await userBot.pickup();
    }
}
