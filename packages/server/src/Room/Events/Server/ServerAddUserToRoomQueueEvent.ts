import { UserModel } from "../../../Database/Models/Users/UserModel";
import RoomServer from "../../RoomServer";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { RoomBellQueueData, RoomBellQueueUserData, ServerAddUserToRoomQueueData, ServerRemoveUserToRoomQueueData } from "@pixel63/events";

export default class ServerAddUserToRoomQueueEvent implements ServerProtobuffListener<ServerAddUserToRoomQueueData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerAddUserToRoomQueueData) {
        const room = RoomServer.roomManager.getRoomInstance(payload.roomId);

        if(!room) {
            RoomServer.websocket.sendServerProtobuff(ServerRemoveUserToRoomQueueData, ServerRemoveUserToRoomQueueData.create({
                roomId: payload.roomId,
                userId: payload.userId
            }));

            throw new Error("Room is not loaded.");
        }

        const user = await UserModel.findByPk(payload.userId);

        if(!user) {
            RoomServer.websocket.sendServerProtobuff(ServerRemoveUserToRoomQueueData, ServerRemoveUserToRoomQueueData.create({
                roomId: payload.roomId,
                userId: payload.userId
            }));
            
            throw new Error("User does not exist.");
        }

        room.queue.push(user);

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
