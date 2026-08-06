import { GetUserBotSpeechData, UserBotSpeechData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";

export default class GetRoomBotSpeechEvent implements RoomProtobuffListener<GetUserBotSpeechData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: User, payload: GetUserBotSpeechData) {
        const bot = user.roomUser.room.getBot(payload.id);

        if(bot.model.user.id !== user.id) {
            throw new Error("User does not own the bot.");
        }

        user.sendProtobuff(UserBotSpeechData, UserBotSpeechData.create({
            botId: bot.model.id,

            speech: bot.model.speech
        }));
    }
}
