import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { SendUserMessageEventData } from "@shared/Communications/Requests/Rooms/User/SendUserMessageEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { UserChatEventData } from "@shared/Communications/Responses/Rooms/Users/UserChatEventData.js";
import { game } from "../../../../index.js";
import { UserTypingEventData } from "@shared/Communications/Responses/Rooms/Users/UserTypingEventData.js";

export default class SendUserMessageEvent implements IncomingEvent<SendUserMessageEventData> {
    public readonly name = "SendUserMessageEvent";

    async handle(user: User, event: SendUserMessageEventData) {
        if(!user.room) {
            return;
        }

        if(!event.message.length) {
            throw new Error("Message is empty.");
        }

        const roomUser = user.room.getRoomUser(user);

        if(event.message.includes(":)")) {
            roomUser.addAction("GestureSmile");
        }
        else if(event.message.includes(":D")) {
            roomUser.addAction("Laugh");
        }
        else if(event.message.includes(":(")) {
            roomUser.addAction("GestureSad");
        }
        else if(event.message.includes(":@")) {
            roomUser.addAction("GestureAngry");
        }
        else if(event.message.toLowerCase().includes(":o")) {
            roomUser.addAction("GestureSurprised");
        }

        if(event.message[0] === ':' || event.message[0] === '/') {
            const parts = event.message.split(' ');

            game.commandHandler.dispatchCommand(roomUser, parts[0]!.substring(1), parts.slice(1));

            if(roomUser.typing) {
                roomUser.typing = false;

                user.room.sendRoomEvent(new OutgoingEvent<UserTypingEventData>("UserTypingEvent", {
                    userId: user.model.id,
                    typing: roomUser.typing
                }));
            }

            return;
        }

        roomUser.typing = false;

        roomUser.sendRoomMessage(event.message);
    }
}
