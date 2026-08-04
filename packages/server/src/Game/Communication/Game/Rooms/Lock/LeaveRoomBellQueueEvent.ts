import { EnterRoomBellQueueData, ExitRoomBellQueueData, RoomBellQueueData, RoomBellQueueUserData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";

export default class LeaveRoomBellQueueEvent implements ProtobuffListener<ExitRoomBellQueueData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: ExitRoomBellQueueData) {
        if(!user.roomBellQueue) {
            return;
        }

        const room = user.roomBellQueue;
        user.roomBellQueue = undefined;

        for(const roomUserWithRights of room.users.filter((user) => user.hasRights())) {
            roomUserWithRights.user.sendProtobuff(RoomBellQueueData, RoomBellQueueData.create({
                users: game.users.filter((user) => user.roomBellQueue?.model.id === roomUserWithRights.room.model.id).map((user) => {
                    return RoomBellQueueUserData.create({
                        id: user.model.id,
                        name: user.model.name
                    })
                })
            }));
        }
    }
}
