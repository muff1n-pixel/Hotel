import { PlaceBotEventData } from "@shared/Communications/Requests/Rooms/Bots/PlaceBotEventData.js";
import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import RoomBot from "../../../../Rooms/Bots/RoomBot.js";

export default class PlaceBotEvent implements IncomingEvent<PlaceBotEventData> {
    public readonly name = "PlaceBotEvent";

    async handle(user: User, event: PlaceBotEventData) {
        if(!user.room) {
            return;
        }

        if(user.model.id !== user.room.model.owner.id) {
            throw new Error("User does not own the room.");
        }

        const inventory = user.getInventory();

        const userBot = await inventory.getBotById(event.userBotId);

        if(!userBot) {
            throw new Error("User does not have a user bot by this id.");
        }

        await inventory.removeBot(userBot);

        await RoomBot.place(user.room, userBot, event.position, event.direction);
    }
}
