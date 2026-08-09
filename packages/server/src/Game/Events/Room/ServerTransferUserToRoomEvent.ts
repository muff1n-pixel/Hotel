import { ServerTransferUserToRoomData, UpdateRoomBellQueueData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomWorker from "../../Rooms/RoomWorker";
import { game } from "../..";

export default class ServerTransferUserToRoomEvent implements ServerProtobuffListener<ServerTransferUserToRoomData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerTransferUserToRoomData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }

        user.room?.disconnect();

        const room = await game.roomWorkerPool.getOrCreateRoom(payload.roomId);

        if(!room) {
            throw new Error("Room does not exist.");
        }

        room.worker.addUserToRoom(user, payload.roomId, payload.userFurnitureId);
    }
}
