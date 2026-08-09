import { ServerUpdateUserRoomQueueData, UpdateRoomBellQueueData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomWorker from "../../Rooms/RoomWorker";
import { game } from "../..";

export default class ServerUpdateUserRoomQueueEvent implements ServerProtobuffListener<ServerUpdateUserRoomQueueData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerUpdateUserRoomQueueData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }

        if(user.roomBellQueue?.roomId !== payload.roomId) {
            throw new Error("User is not waiting for room.");
        }

        user.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
            userId: user.model.id,
            accept: payload.accept
        }));

        user.roomBellQueue = undefined;

        if(payload.accept) {
            const room = game.roomWorkerPool.getRoom(payload.roomId);

            room?.worker.addUserToRoom(user, payload.roomId);
        }
    }
}
