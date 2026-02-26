import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { SendUserMessageEventData } from "@shared/Communications/Requests/Rooms/User/SendUserMessageEventData.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { game } from "../../../../index.js";
import { UserTypingEventData } from "@shared/Communications/Responses/Rooms/Users/UserTypingEventData.js";
import { RoomChatEventData } from "@shared/Communications/Responses/Rooms/Chat/RoomChatEventData.js";

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

        roomUser.lastActivity = performance.now();

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

        let userChatBlocked = false;

        const furnitureWithUserChatLogic = roomUser.room.furnitures.filter(async (furniture) => {
            return furniture.getCategoryLogic()?.handleUserChat !== undefined;
        });

        for(const furniture of furnitureWithUserChatLogic) {
            const result = await furniture.getCategoryLogic()?.handleUserChat?.(roomUser, event.message);

            if(result?.blockUserChat) {
                userChatBlocked = true;
            }
        }

        roomUser.typing = false;

        if(!userChatBlocked) {
            roomUser.sendRoomMessage(event.message);
        }
        else {
            user.send(new OutgoingEvent<RoomChatEventData>("RoomChatEvent", {
                type: "user",
                userId: user.model.id,
                message: event.message,
                roomChatStyleId: user.model.roomChatStyleId,
                options: {
                    italic: true,
                    transparent: true
                }
            }));

            user.room.sendRoomEvent(new OutgoingEvent<UserTypingEventData>("UserTypingEvent", {
                userId: user.model.id,
                typing: roomUser.typing
            }));
        }
    }
}
