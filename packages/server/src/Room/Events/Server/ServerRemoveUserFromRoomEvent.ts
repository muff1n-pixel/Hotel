import { ServerLoadRoomData, ServerRemoveUserFromRoomData, ServerRoomLoadedData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServer from "../../RoomServer";

export default class ServerRemoveUserFromRoomEvent implements ServerProtobuffListener<ServerRemoveUserFromRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerRemoveUserFromRoomData) {
        const room = RoomServer.roomManager.getRoomInstance(payload.roomId);

        if(!room) {
            throw new Error("Room is not loaded.");
        }
        
        const roomUser = room.getRoomUserById(payload.userId);

        roomUser.disconnect();
    }
}
