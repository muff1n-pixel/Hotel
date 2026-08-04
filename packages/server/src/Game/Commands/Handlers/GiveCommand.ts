import { RoomActorChatData } from "@pixel63/events";
import { game } from "../../index.js";
import RoomUser from "../../Rooms/Users/RoomUser.js";
import UserPermissions from "../../Users/Permissions/UserPermissions.js";
import Command from "../Command.js";

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

        const targetUser = game.getUserById(user.id);

        if(targetUser) {
            switch(currency) {
                case "duckets":
                case "diamonds":
                case "credits": {
                    targetUser.model[currency] += value;

                    break;
                }
            }

            await targetUser.model.save();

            targetUser.sendUserData();
        }
        else {
            switch(currency) {
                case "duckets":
                case "diamonds":
                case "credits": {
                    user[currency] += value;

                    break;
                }
            }

            await user.save();
        }

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
