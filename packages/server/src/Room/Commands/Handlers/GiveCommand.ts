import { RoomActorChatData, ServerUserUpdatedData } from "@pixel63/events";
import RoomUser from "../../../Room/Rooms/Users/RoomUser.js";
import Command from "../Command.js";
import UserPermissions from "../../../Game/Users/Permissions/UserPermissions.js";
import RoomServer from "../../RoomServer.js";

export default class GiveCommand extends Command {
    validate(roomUser: RoomUser, permissions: UserPermissions) {
        if(!permissions.hasPermission("command:give")) {
            return false;
        }

        return true;
    }

    async handle(roomUser: RoomUser): Promise<void> {
        const user = await this.parseUser("user");
        const value = this.parseNumber("value");
        const currency = this.parseEnum("currency", ["credits", "duckets", "diamonds"] as const);

        switch(currency) {
            case "duckets":
            case "diamonds":
            case "credits": {
                user[currency] += value;

                break;
            }
        }

        await user.save();

        RoomServer.websocket.sendServerProtobuff(ServerUserUpdatedData, ServerUserUpdatedData.create({
            userId: user.id
        }));

        roomUser.user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
            actor: {
                user: {
                    userId: roomUser.user.model.id
                }
            },

            message: `You have given ${user.name} ${value} ${currency}.`,
            roomChatStyleId: "notification",
            options: {
                italic: true,
                hideUsername: true
            }
        }));
    }
}
