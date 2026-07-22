import { RoomGroupData, RoomUserEnteredData } from "@pixel63/events";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";

export default class RoomReadyEvent implements IncomingEvent {
    public readonly name = "RoomReadyEvent";

    async handle(user: User) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(roomUser.ready) {
            return;
        }

        roomUser.ready = true;

        roomUser.user.sendProtobuff(RoomUserEnteredData, RoomUserEnteredData.create({
            user: roomUser.getRoomUserData()
        }));

        const furnitureWithUserEntersLogic = roomUser.room.furnitures.filter((furniture) => furniture.logic?.handleUserEnteredRoom !== undefined);

        for(const furniture of furnitureWithUserEntersLogic) {
            await furniture.logic?.handleUserEnteredRoom?.(roomUser);
        }

        await roomUser.group.refreshUserGroup();
    }
}

