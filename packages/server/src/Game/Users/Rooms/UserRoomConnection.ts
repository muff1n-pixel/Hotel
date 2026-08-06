import { ServerRemoveUserFromRoomData } from "@pixel63/events";
import RoomWorkerWebSocket from "../../Rooms/RoomWorkerWebSocket";
import User from "../User";

export default class UserRoomConnection {
    constructor(private readonly user: User, public readonly client: RoomWorkerWebSocket, private readonly roomId: string) {

    }

    public disconnect() {
        this.client.sendProtobuff(ServerRemoveUserFromRoomData, ServerRemoveUserFromRoomData.create({
            userId: this.user.model.id,
            roomId: this.roomId
        }));

        this.user.room = undefined;
    }
}
