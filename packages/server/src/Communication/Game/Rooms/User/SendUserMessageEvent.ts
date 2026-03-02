import User from "../../../../Users/User.js";
import { game } from "../../../../index.js";
import { RoomActorChatData, RoomUserData, SendRoomChatMessageData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class SendUserMessageEvent implements ProtobuffListener<SendRoomChatMessageData> {
    public readonly name = "SendUserMessageEvent";

    async handle(user: User, payload: SendRoomChatMessageData) {
        if(!user.room) {
            return;
        }

        if(!payload.message.length) {
            throw new Error("Message is empty.");
        }

        const roomUser = user.room.getRoomUser(user);

        roomUser.lastActivity = performance.now();

        if(payload.message.includes(":)")) {
            roomUser.addAction("GestureSmile");
        }
        else if(payload.message.includes(":D")) {
            roomUser.addAction("Laugh");
        }
        else if(payload.message.includes(":(")) {
            roomUser.addAction("GestureSad");
        }
        else if(payload.message.includes(":@")) {
            roomUser.addAction("GestureAngry");
        }
        else if(payload.message.toLowerCase().includes(":o")) {
            roomUser.addAction("GestureSurprised");
        }

        if(payload.message[0] === ':' || payload.message[0] === '/') {
            const parts = payload.message.split(' ');

            game.commandHandler.dispatchCommand(roomUser, parts[0]!.substring(1), parts.slice(1));

            if(roomUser.typing) {
                roomUser.typing = false;

                user.room.sendProtobuff(RoomUserData, RoomUserData.create({
                    id: user.model.id,
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
            const result = await furniture.getCategoryLogic()?.handleUserChat?.(roomUser, payload.message);

            if(result?.blockUserChat) {
                userChatBlocked = true;
            }
        }

        roomUser.typing = false;

        if(!userChatBlocked) {
            roomUser.sendRoomMessage(payload.message);
        }
        else {
            user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                actor: {
                    user: {
                        userId: user.model.id
                    }
                },
                message: payload.message,
                roomChatStyleId: user.model.roomChatStyleId,
                options: {
                    italic: true,
                    transparent: true
                }
            }));

            user.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: user.model.id,
                typing: roomUser.typing
            }));
        }
    }
}
