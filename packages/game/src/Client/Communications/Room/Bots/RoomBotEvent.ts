import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomBotEventData } from "@Shared/Communications/Responses/Rooms/Bots/RoomBotEventData";
import { clientInstance } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import RoomBot from "@Client/Room/Bots/RoomBot";

export default class RoomBotEvent implements IncomingEvent<WebSocketEvent<RoomBotEventData>> {
    async handle(event: WebSocketEvent<RoomBotEventData>) {
        if(!clientInstance.roomInstance.value) {
            throw new Error("Room instance is not created.");
        }

        if(event.data.botUpdated?.length) {
            for(const data of event.data.botUpdated) {
                const bot = clientInstance.roomInstance.value.getBotById(data.id);

                bot.updateData(data);
            }
        }

        if(event.data.botAdded?.length) {
            clientInstance.roomInstance.value.bots.push(...event.data.botAdded.map((botData) => new RoomBot(clientInstance.roomInstance.value!, botData)));
        }

        if(event.data.botRemoved?.length) {
            event.data.botRemoved.forEach((botData) => {
                clientInstance.roomInstance.value!.removeBot(botData.id);

                if(clientInstance.roomInstance.value?.focusedUser.value?.type === "bot" && clientInstance.roomInstance.value?.focusedUser.value?.bot.data.id === botData.id) {
                    clientInstance.roomInstance.value.focusedUser.value = null;
                }
            });
        }

        clientInstance.roomInstance.update();
    }
}
