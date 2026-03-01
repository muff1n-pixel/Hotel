import User from "../../../../Users/User.js";
import RoomBot from "../../../../Rooms/Bots/RoomBot.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PlaceRoomBotData } from "@pixel63/events";

export default class PlaceBotEvent implements ProtobuffListener<PlaceRoomBotData> {
    async handle(user: User, payload: PlaceRoomBotData) {
        if(!user.room) {
            return;
        }

        if(user.model.id !== user.room.model.owner.id) {
            throw new Error("User does not own the room.");
        }

        const inventory = user.getInventory();

        const userBot = await inventory.getBotById(payload.id);

        if(!userBot) {
            throw new Error("User does not have a user bot by this id.");
        }

        if(!payload.position) {
            throw new Error();
        }

        await inventory.removeBot(userBot);

        await RoomBot.place(user.room, userBot, payload.position, payload.direction);
    }
}
