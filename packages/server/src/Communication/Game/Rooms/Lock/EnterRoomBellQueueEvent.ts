import { EnterRoomBellQueueData, RoomBellQueueData, RoomBellQueueUserData, UpdateRoomBellQueueData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";

export default class EnterRoomBellQueueEvent implements ProtobuffListener<EnterRoomBellQueueData> {
    minimumDurationBetweenEvents?: number = 10_000;

    async handle(user: User, payload: EnterRoomBellQueueData) {
        if(user.roomBellQueue) {
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

        const room = game.roomManager.getRoomInstance(payload.roomId);

        if(!room || !room.users.filter((user) => user.hasRights()).length) {
            user.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
                userId: user.model.id,
                accept: false
            }));

            return;
        }

        user.roomBellQueue = room;

        for(const roomUserWithRights of user.roomBellQueue.users.filter((user) => user.hasRights())) {
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
