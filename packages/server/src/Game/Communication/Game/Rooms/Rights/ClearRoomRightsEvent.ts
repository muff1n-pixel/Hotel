import User from "../../../../Users/User.js";
import { RoomRightsModel } from "../../../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { randomUUID } from "node:crypto";
import { RoomUserData, ClearRoomRightsData, GetRoomRightsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import GetRoomRightsEvent from "./GetRoomRightsEvent.js";

export default class ClearRoomRightsEvent implements ProtobuffListener<ClearRoomRightsData> {
    minimumDurationBetweenEvents?: number = 10;
    
    async handle(user: User, payload: ClearRoomRightsData) {
        if(!user.room) {
            return;
        }

        if(user.room.model.owner.id !== user.model.id) {
            throw new Error("User is not room owner.");
        }

        for(const rights of user.room.model.rights) {
            await rights.destroy();

            user.room.model.rights.splice(user.room.model.rights.indexOf(rights), 1);

            const roomUser = user.room.users.find((user) => user.user.model.id === rights.user.id);

            if(!roomUser) {
                continue;
            }

            user.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: roomUser.user.model.id,
                hasRights: roomUser.hasRights()
            }));
        }

        await new GetRoomRightsEvent().handle(user, GetRoomRightsData.create({}));
    }
}
