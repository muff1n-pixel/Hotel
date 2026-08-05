import { RoomRightsModel } from "../../../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { randomUUID } from "node:crypto";
import { GetRoomRightsData, RoomUserData, SetRoomUserRightsData } from "@pixel63/events";
import GetRoomRightsEvent from "../Rights/GetRoomRightsEvent.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";

export default class UpdateUserRightsEvent implements RoomProtobuffListener<SetRoomUserRightsData> {
    minimumDurationBetweenEvents?: number = 10;
    
    async handle(user: RoomWebSocketUser, payload: SetRoomUserRightsData) {
        if(user.roomUser.room.model.owner.id !== user.id) {
            throw new Error("User is not room owner.");
        }

        const targetUser = await UserModel.findByPk(payload.id);

        if(!targetUser) {
            throw new Error("Target user does not exist.");
        }

        if(user.roomUser.room.model.owner.id === targetUser.id) {
            throw new Error("Target user is room owner.");
        }

        const hasRights = user.roomUser.room.model.rights.some((rights) => rights.user.id === targetUser.id);

        if(payload.hasRights && !hasRights) {
            const rights = await RoomRightsModel.create({
                id: randomUUID(),
                roomId: user.roomUser.room.model.id,
                userId: targetUser.id
            });

            rights.room = user.roomUser.room.model;
            rights.user = targetUser;

            user.roomUser.room.model.rights.push(rights);
        }
        else if(!payload.hasRights && hasRights) {
            const rights = user.roomUser.room.model.rights.find((rights) => rights.user.id === targetUser.id);

            if(!rights) {
                throw new Error("User does not have rights.");
            }

            await rights.destroy();

            user.roomUser.room.model.rights.splice(user.roomUser.room.model.rights.indexOf(rights), 1);
        }
        else {
            console.debug("User already has equivalent rights.");

            return;
        }
        
        const targetRoomUser = user.roomUser.room.users.find((roomUser) => roomUser.user.model.id === targetUser.id);

        if(targetRoomUser) {
            user.roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: targetRoomUser.user.model.id,
                hasRights: targetRoomUser.hasRights()
            }));
        }

        await new GetRoomRightsEvent().handle(user, GetRoomRightsData.create({}));
    }
}
