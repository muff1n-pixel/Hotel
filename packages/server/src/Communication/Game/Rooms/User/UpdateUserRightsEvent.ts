import User from "../../../../Users/User.js";
import { RoomRightsModel } from "../../../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { randomUUID } from "node:crypto";
import { RoomUserData, SetRoomUserRightsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class UpdateUserRightsEvent implements ProtobuffListener<SetRoomUserRightsData> {
    async handle(user: User, payload: SetRoomUserRightsData) {
        if(!user.room) {
            return;
        }

        if(user.room.model.owner.id !== user.model.id) {
            throw new Error("User is not room owner.");
        }

        const targetUser = user.room.getRoomUserById(payload.id);

        if(user.room.model.owner.id === targetUser.user.model.id) {
            throw new Error("Target user is room owner.");
        }

        if(payload.hasRights && !targetUser.hasRights()) {
            const rights = await RoomRightsModel.create({
                id: randomUUID(),
                roomId: user.room.model.id,
                userId: targetUser.user.model.id
            });

            rights.room = user.room.model;
            rights.user = targetUser.user.model;

            user.room.model.rights.push(rights);
        }
        else if(!payload.hasRights && targetUser.hasRights()) {
            const rights = user.room.model.rights.find((rights) => rights.user.id === targetUser.user.model.id);

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

        user.room.sendProtobuff(RoomUserData, RoomUserData.create({
            id: targetUser.user.model.id,
            hasRights: targetUser.hasRights()
        }));
    }
}
