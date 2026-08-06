import RoomServer from "../../RoomServer";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { RoomBellQueueData, RoomBellQueueUserData, ServerRemoveUserToRoomQueueData } from "@pixel63/events";

export default class ServerRemoveUserToRoomQueueEvent implements ServerProtobuffListener<ServerRemoveUserToRoomQueueData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerRemoveUserToRoomQueueData) {
        const room = RoomServer.roomManager.getRoomInstance(payload.roomId);

        if(!room) {
            throw new Error("Room is not loaded.");
        }

        const index = room.queue.findIndex((user) => user.id === payload.userId);

        if(index == -1) {
            throw new Error("User is not in room queue.");
        }

        room.queue.splice(index, 1);

        for(const roomUserWithRights of room.users.filter((user) => user.hasRights())) {
            roomUserWithRights.user.sendProtobuff(RoomBellQueueData, RoomBellQueueData.create({
                users: room.queue.map((user) => {
                    return RoomBellQueueUserData.create({
                        id: user.id,
                        name: user.name
                    })
                })
            }));
        }
    }
}
