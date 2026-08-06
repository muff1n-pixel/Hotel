import { RoomBellQueueData, RoomBellQueueUserData, ServerUpdateUserRoomQueueData, UpdateRoomBellQueueData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";
import RoomServer from "../../../RoomServer";

export default class UpdateRoomBellQueueEvent implements RoomProtobuffListener<UpdateRoomBellQueueData> {
    async handle(user: User, payload: UpdateRoomBellQueueData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const userQueue = user.room.queue.find((queuedUser) => queuedUser.id === payload.userId);

        if(!userQueue) {
            throw new Error("Target user is not waiting for this room.");
        }

        RoomServer.websocket.sendServerProtobuff(ServerUpdateUserRoomQueueData, ServerUpdateUserRoomQueueData.create({
            userId: userQueue.id,
            roomId: user.room.model.id,
            accept: payload.accept
        }));

        const index = user.room.queue.indexOf(userQueue);

        if(index !== -1) {
            user.room.queue.splice(index, 1);
        }

        for(const roomUserWithRights of user.room.users.filter((user) => user.hasRights())) {
            roomUserWithRights.user.sendProtobuff(RoomBellQueueData, RoomBellQueueData.create({
                users: user.room.queue.map((user) => {
                    return RoomBellQueueUserData.create({
                        id: user.id,
                        name: user.name
                    })
                })
            }));
        }
    }
}
