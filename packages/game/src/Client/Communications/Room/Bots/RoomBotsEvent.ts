import { clientInstance } from "../../../..";
import RoomBot from "@Client/Room/Bots/RoomBot";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomBotsData } from "@pixel63/events";

export default class RoomBotsEvent implements ProtobuffListener<RoomBotsData> {
    async handle(payload: RoomBotsData) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(payload.botsUpdated?.length) {
            for(const data of payload.botsUpdated) {
                const bot = clientInstance.roomInstance.value.getBotById(data.id);

                bot.updateData(data);
            }
        }

        if(payload.botsAdded?.length) {
            clientInstance.roomInstance.value.bots.push(...payload.botsAdded.map((botData) => new RoomBot(clientInstance.roomInstance.value!, botData)));
        }

        if(payload.botsRemoved?.length) {
            payload.botsRemoved.forEach((botData) => {
                clientInstance.roomInstance.value!.removeBot(botData.id);

                if(clientInstance.roomInstance.value?.focusedUser.value?.type === "bot" && clientInstance.roomInstance.value?.focusedUser.value?.bot.data.id === botData.id) {
                    clientInstance.roomInstance.value.focusedUser.value = null;
                }
            });
        }

        clientInstance.roomInstance.update();
    }
}
