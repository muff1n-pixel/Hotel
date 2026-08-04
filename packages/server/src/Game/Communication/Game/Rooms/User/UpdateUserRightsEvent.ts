import User from "../../../../Users/User.js";
import { RoomRightsModel } from "../../../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { randomUUID } from "node:crypto";
import { GetRoomRightsData, RoomUserData, SetRoomUserRightsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import GetRoomRightsEvent from "../Rights/GetRoomRightsEvent.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";

export default class UpdateUserRightsEvent implements ProtobuffListener<SetRoomUserRightsData> {
    minimumDurationBetweenEvents?: number = 10;
    
    async handle(user: User, payload: SetRoomUserRightsData) {
        if(!user.room) {
            return;
        }

        if(user.room.model.owner.id !== user.model.id) {
            throw new Error("User is not room owner.");
        }

        const targetUser = await UserModel.findByPk(payload.id);

        if(!targetUser) {
            throw new Error("Target user does not exist.");
        }

        if(user.room.model.owner.id === targetUser.id) {
            throw new Error("Target user is room owner.");
        }

        const hasRights = user.room.model.rights.some((rights) => rights.user.id === targetUser.id);

        if(payload.hasRights && !hasRights) {
            const rights = await RoomRightsModel.create({
                id: randomUUID(),
                roomId: user.room.model.id,
                userId: targetUser.id
            });

            rights.room = user.room.model;
            rights.user = targetUser;

            user.room.model.rights.push(rights);
        }
        else if(!payload.hasRights && hasRights) {
            const rights = user.room.model.rights.find((rights) => rights.user.id === targetUser.id);

            if(!rights) {
                throw new Error("User does not have rights.");
            }

            await rights.destroy();

            user.room.model.rights.splice(user.room.model.rights.indexOf(rights), 1);
        }
        else {
            console.debug("User already has equivalent rights.");

            return;
        }
        
        const targetRoomUser = user.room.users.find((roomUser) => roomUser.user.model.id === targetUser.id);

        if(targetRoomUser) {
            user.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: targetRoomUser.user.model.id,
                hasRights: targetRoomUser.hasRights()
            }));
        }

        await new GetRoomRightsEvent().handle(user, GetRoomRightsData.create({}));
    }
}
