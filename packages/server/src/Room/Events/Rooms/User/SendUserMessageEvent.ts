import { RoomActorChatData, RoomUserData, SendRoomChatMessageData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";
import RoomServer from "../../../RoomServer.js";

export default class SendUserMessageEvent implements RoomProtobuffListener<SendRoomChatMessageData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User, payload: SendRoomChatMessageData) {
        if(!payload.message.length) {
            throw new Error("Message is empty.");
        }

        if(payload.message.length > 100) {
            throw new Error("Message exceeds 100 characters.");
        }

        user.roomUser.lastActivity = performance.now();

        if(payload.message.includes(":)")) {
            user.roomUser.pose.smile();
        }
        else if(payload.message.includes(":D")) {
            user.roomUser.pose.laugh();
        }
        else if(payload.message.includes(":(")) {
            user.roomUser.pose.sad();
        }
        else if(payload.message.includes(":@")) {
            user.roomUser.pose.angry();
        }
        else if(payload.message.toLowerCase().includes(":o")) {
            user.roomUser.pose.surprised();
        }

        const parts = payload.message.split(' ');

        if(payload.message[0] === ':' || payload.message[0] === '/') {
            if(user.roomUser.typing) {
                user.roomUser.typing = false;

                user.roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
                    id: user.id,
                    typing: user.roomUser.typing
                }));
            }

            if(await RoomServer.commandHandler.handleCommand(user.roomUser, parts[0]!.substring(1), parts.slice(1).join(' '), payload.focusedUserId)) {
                return;
            }
        }

        let userChatBlocked = false;

        const furnitureWithUserChatLogic = user.roomUser.room.furnitures.filter((furniture) => {
            return furniture.logic?.handleUserChat !== undefined;
        });

        for(const furniture of furnitureWithUserChatLogic) {
            const result = await furniture.logic?.handleUserChat?.(user.roomUser, payload.message);

            if(result?.blockUserChat) {
                userChatBlocked = true;
            }
        }

        user.roomUser.typing = false;

        if(!userChatBlocked) {
            user.roomUser.sendRoomMessage(payload.message);

            for(const roomPet of user.roomUser.room.pets) {
                const nameIndex = parts.indexOf(roomPet.model.name);

                if(nameIndex !== -1 && parts[nameIndex + 1]) {
                    await RoomServer.petCommandHandler.handleCommand(user.roomUser, roomPet, parts[nameIndex + 1]!, parts.slice(nameIndex + 1).join(' '));
                }
            }
        }
        else {
            user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                actor: {
                    user: {
                        userId: user.id
                    }
                },
                message: payload.message,
                roomChatStyleId: user.roomChatStyleId,
                options: {
                    italic: true,
                    transparent: true
                }
            }));

            user.roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: user.id,
                typing: user.roomUser.typing
            }));
        }
    }
}
