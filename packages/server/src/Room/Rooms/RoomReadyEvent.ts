import { RoomEventData, RoomGroupData, RoomReadyData, RoomUserEnteredData } from "@pixel63/events";
import { RoomProtobuffListener } from "../Events/Interfaces/RoomProtobuffListener.js";
import User from "../Users/User.js";

export default class RoomReadyEvent implements RoomProtobuffListener<RoomReadyData> {
    async handle(user: User) {
        if(user.roomUser.ready) {
            return;
        }

        user.roomUser.ready = true;

        user.roomUser.user.sendProtobuff(RoomUserEnteredData, RoomUserEnteredData.create({
            user: user.roomUser.getRoomUserData()
        }));

        const furnitureWithUserEntersLogic = user.roomUser.room.furnitures.filter((furniture) => furniture.logic?.handleUserEnteredRoom !== undefined);

        for(const furniture of furnitureWithUserEntersLogic) {
            await furniture.logic?.handleUserEnteredRoom?.(user.roomUser);
        }

        await user.roomUser.group.refreshUserGroup();

        user.sendProtobuff(RoomEventData, user.roomUser.room.event.getEventData());
    }
}

