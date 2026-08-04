import User from "../../../../Users/User.js";
import { game } from "../../../../index.js";
import { RoomActorChatData, RoomUserData, SendRoomChatMessageData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class SendUserMessageEvent implements ProtobuffListener<SendRoomChatMessageData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User, payload: SendRoomChatMessageData) {
        if(!user.room) {
            return;
        }

        if(!payload.message.length) {
            throw new Error("Message is empty.");
        }

        if(payload.message.length > 100) {
            throw new Error("Message exceeds 100 characters.");
        }

        const roomUser = user.room.getRoomUser(user);

        roomUser.lastActivity = performance.now();

        if(payload.message.includes(":)")) {
            roomUser.pose.smile();
        }
        else if(payload.message.includes(":D")) {
            roomUser.pose.laugh();
        }
        else if(payload.message.includes(":(")) {
            roomUser.pose.sad();
        }
        else if(payload.message.includes(":@")) {
            roomUser.pose.angry();
        }
        else if(payload.message.toLowerCase().includes(":o")) {
            roomUser.pose.surprised();
        }

        const parts = payload.message.split(' ');

        if(payload.message[0] === ':' || payload.message[0] === '/') {
            if(roomUser.typing) {
                roomUser.typing = false;

                user.room.sendProtobuff(RoomUserData, RoomUserData.create({
                    id: user.model.id,
                    typing: roomUser.typing
                }));
            }

            if(await game.commandHandler.handleCommand(roomUser, parts[0]!.substring(1), parts.slice(1).join(' '), payload.focusedUserId)) {
                return;
            }
        }

        let userChatBlocked = false;

        const furnitureWithUserChatLogic = roomUser.room.furnitures.filter((furniture) => {
            return furniture.logic?.handleUserChat !== undefined;
        });

        for(const furniture of furnitureWithUserChatLogic) {
            const result = await furniture.logic?.handleUserChat?.(roomUser, payload.message);

            if(result?.blockUserChat) {
                userChatBlocked = true;
            }
        }

        roomUser.typing = false;

        if(!userChatBlocked) {
            roomUser.sendRoomMessage(payload.message);

            for(const roomPet of user.room.pets) {
                const nameIndex = parts.indexOf(roomPet.model.name);

                if(nameIndex !== -1 && parts[nameIndex + 1]) {
                    await game.petCommandHandler.handleCommand(roomUser, roomPet, parts[nameIndex + 1]!, parts.slice(nameIndex + 1).join(' '));
                }
            }
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
