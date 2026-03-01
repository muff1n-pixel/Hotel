import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { UpdateRoomBotEventData } from "@shared/Communications/Requests/Rooms/Bots/UpdateRoomBotEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { RoomBotsData } from "@pixel63/events";

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

        if(event.relaxed !== undefined) {
            bot.model.relaxed = event.relaxed === true;
        }

        if(event.speech !== undefined) {
            bot.model.speech = {
                automaticChat: event.speech.automaticChat === true,
                automaticChatDelay: Math.max(5, Math.min(5 * 60, event.speech.automaticChatDelay)),
                randomizeMessages: event.speech.randomizeMessages === true,

                messages: event.speech.messages.filter((message) => message.length > 0 && message.length < 128)
            };
        }

        await bot.model.save();

        user.room.sendProtobuff(RoomBotsData, RoomBotsData.create({
            botsUpdated: [
                bot.model.toJSON()
            ]
        }));
    }
}
