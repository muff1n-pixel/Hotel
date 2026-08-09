import { ServerAddUserToRoomQueueData, ServerRemoveUserToRoomQueueData } from "@pixel63/events";
import { game } from "../..";
import User from "../User";

export default class UserRoomQueue {
    constructor(private readonly user: User, public readonly roomId: string) {
        const roomWorker = game.roomWorkerPool.getRoom(this.roomId);

        if(roomWorker) {
            roomWorker.worker.client.sendProtobuff(ServerAddUserToRoomQueueData, ServerAddUserToRoomQueueData.create({
                userId: this.user.model.id,
                roomId: this.roomId
            }));
        }
    }

    public cancel() {
        this.user.roomBellQueue = undefined;

        const roomWorker = game.roomWorkerPool.getRoom(this.roomId);

        if(roomWorker) {
            roomWorker.worker.client.sendProtobuff(ServerRemoveUserToRoomQueueData, ServerRemoveUserToRoomQueueData.create({
                userId: this.user.model.id,
                roomId: this.roomId
            }));
        }
    }
}