import User from "../../../../Users/User.js";
import { RoomBotsData, UpdateRoomBotData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class UpdateRoomBotEvent implements ProtobuffListener<UpdateRoomBotData> {
    async handle(user: User, payload: UpdateRoomBotData) {
        if(!user.room) {
            return;
        }

        const bot = user.room.getBot(payload.id);

        if(bot.model.user.id !== user.model.id) {
            throw new Error("User does not own the bot.");
        }

        if(payload.direction !== undefined) {
            bot.model.direction = payload.direction;
        }

        if(payload.position !== undefined) {
            bot.setPosition(payload.position, false);
        }

        if(payload.figureConfiguration !== undefined) {
            bot.model.figureConfiguration = payload.figureConfiguration;
        }

        if(payload.motto !== undefined) {
            bot.model.motto = payload.motto;
        }

        if(payload.relaxed !== undefined) {
            bot.model.relaxed = payload.relaxed === true;
        }

        if(payload.speech !== undefined) {
            bot.model.speech = {
                $type: "BotSpeechData",
                automaticChat: payload.speech.automaticChat === true,
                automaticChatDelay: Math.max(5, Math.min(5 * 60, payload.speech.automaticChatDelay)),
                randomizeMessages: payload.speech.randomizeMessages === true,

                messages: payload.speech.messages.filter((message) => message.length > 0 && message.length < 128)
            };
        }

        await bot.model.save();

        user.room.sendProtobuff(RoomBotsData, RoomBotsData.fromJSON({
            botsUpdated: [
                bot.model
            ]
        }));
    }
}
