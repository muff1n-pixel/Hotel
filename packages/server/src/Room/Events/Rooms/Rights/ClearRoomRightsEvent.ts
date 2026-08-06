import { RoomUserData, ClearRoomRightsData, GetRoomRightsData } from "@pixel63/events";
import GetRoomRightsEvent from "./GetRoomRightsEvent.js";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";

export default class ClearRoomRightsEvent implements RoomProtobuffListener<ClearRoomRightsData> {
    minimumDurationBetweenEvents?: number = 10;
    
    async handle(user: User, payload: ClearRoomRightsData) {
        if(user.roomUser.room.model.owner.id !== user.id) {
            throw new Error("User is not room owner.");
        }

        for(const rights of user.roomUser.room.model.rights) {
            await rights.destroy();

            user.roomUser.room.model.rights.splice(user.roomUser.room.model.rights.indexOf(rights), 1);

            const roomUser = user.roomUser.room.users.find((user) => user.user.model.id === rights.user.id);

            if(!roomUser) {
                continue;
            }

            user.roomUser.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: roomUser.user.model.id,
                hasRights: roomUser.hasRights()
            }));
        }

        await new GetRoomRightsEvent().handle(user, GetRoomRightsData.create({}));
    }
}
