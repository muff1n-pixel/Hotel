import { LeaveRoomData, ServerRemoveUserToRoomQueueData, ServerUserRemovedFromRoomData, UpdateRoomBellQueueData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomWorker from "../../Rooms/RoomWorker";
import { game } from "../..";

export default class ServerUserRemovedFromRoomEvent implements ServerProtobuffListener<ServerUserRemovedFromRoomData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerUserRemovedFromRoomData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }

        if(user.room?.roomId !== payload.roomId) {
            return;
        }

        user.sendProtobuff(LeaveRoomData, LeaveRoomData.create({}));
    }
}
