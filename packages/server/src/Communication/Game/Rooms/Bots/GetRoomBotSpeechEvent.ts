import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { GetRoomBotSpeechEventData } from "@shared/Communications/Requests/Rooms/Bots/GetRoomBotSpeechEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { UserBotSpeechData } from "@pixel63/events";

export default class GetRoomBotSpeechEvent implements IncomingEvent<GetRoomBotSpeechEventData> {
    public readonly name = "GetRoomBotSpeechEvent";

    async handle(user: User, event: GetRoomBotSpeechEventData) {
        if(!user.room) {
            return;
        }

        const bot = user.room.getBot(event.userBotId);

        if(bot.model.user.id !== user.model.id) {
            throw new Error("User does not own the bot.");
        }

        user.sendProtobuff(UserBotSpeechData, UserBotSpeechData.create({
            botId: bot.model.id,

            speech: bot.model.speech
        }));
    }
}
