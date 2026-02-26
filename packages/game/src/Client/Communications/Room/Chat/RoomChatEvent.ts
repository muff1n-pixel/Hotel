import IncomingEvent from "@Client/Communications/IncomingEvent";
import { RoomChatEventData } from "@Shared/Communications/Responses/Rooms/Chat/RoomChatEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { clientInstance } from "../../../..";

export default class RoomChatEvent implements IncomingEvent<WebSocketEvent<RoomChatEventData>> {
    async handle(event: WebSocketEvent<RoomChatEventData>) {
        if(event.data.type === "user") {
            const roomUser = clientInstance.roomInstance.value?.getUserById(event.data.userId);

            if(roomUser) {
                roomUser.item.typing = false;

                if(!event.data.options?.hideUsername) {
                    roomUser.item.figureRenderer.addAction("Talk");

                    setTimeout(() => {
                        roomUser.item.figureRenderer.removeAction("Talk");
                    }, Math.max(800, event.data.message.length * 60));
                }
            }
        }
        else if(event.data.type === "bot") {
            const bot = clientInstance.roomInstance.value?.getBotById(event.data.botId);

            if(bot) {
                bot.item.figureRenderer.addAction("Talk");

                setTimeout(() => {
                    bot.item.figureRenderer.removeAction("Talk");
                }, Math.max(800, event.data.message.length * 60));
            }
        }
    }
}
