import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { GetUserBotSpeechData, UserBotSpeechData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class GetRoomBotSpeechEvent implements ProtobuffListener<GetUserBotSpeechData> {
    async handle(user: User, payload: GetUserBotSpeechData) {
        if(!user.room) {
            return;
        }

        const bot = user.room.getBot(payload.id);

        if(bot.model.user.id !== user.model.id) {
            throw new Error("User does not own the bot.");
        }

        user.sendProtobuff(UserBotSpeechData, UserBotSpeechData.create({
            botId: bot.model.id,

            speech: bot.model.speech
        }));
    }
}
