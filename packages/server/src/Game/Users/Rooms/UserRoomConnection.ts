import { ServerRemoveUserFromRoomData } from "@pixel63/events";
import RoomServerClient from "../../Rooms/RoomServerClient";
import User from "../User";

export default class UserRoomConnection {
    constructor(private readonly user: User, private readonly client: RoomServerClient, private readonly roomId: string) {

    }

    public disconnect() {
        this.client.sendProtobuff(ServerRemoveUserFromRoomData, ServerRemoveUserFromRoomData.create({
            userId: this.user.model.id,
            roomId: this.roomId
        }));

        this.user.room = undefined;
    }
}
