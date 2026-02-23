import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { UpdateRoomBotEventData } from "@shared/Communications/Requests/Rooms/Bots/UpdateRoomBotEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomBotEventData } from "@shared/Communications/Responses/Rooms/Bots/RoomBotEventData.js";

export default class UpdateRoomBotEvent implements IncomingEvent<UpdateRoomBotEventData> {
    public readonly name = "UpdateRoomBotEvent";

    async handle(user: User, event: UpdateRoomBotEventData) {
        if(!user.room) {
            return;
        }

        const bot = user.room.getBot(event.userBotId);

        if(bot.model.user.id !== user.model.id) {
            throw new Error("User does not own the bot.");
        }

        if(event.direction !== undefined) {
            bot.model.direction = event.direction;
        }

        if(event.position !== undefined) {
            bot.setPosition(event.position, false);
        }

        if(event.figureConfiguration !== undefined) {
            bot.model.figureConfiguration = event.figureConfiguration;
        }

        if(event.motto !== undefined) {
            bot.model.motto = event.motto;
        }

        await bot.model.save();

        user.room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
            botUpdated: [
                bot.getBotData()
            ]
        }));
    }
}
