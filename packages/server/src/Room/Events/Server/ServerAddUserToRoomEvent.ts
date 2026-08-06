import RoomServer from "../../RoomServer";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { ServerAddUserToRoomData } from "@pixel63/events";

export default class ServerAddUserToRoomEvent implements ServerProtobuffListener<ServerAddUserToRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerAddUserToRoomData) {
        RoomServer.pendingUsers = RoomServer.pendingUsers.filter((pendingUser) => pendingUser.userId !== payload.userId);
        
        RoomServer.pendingUsers.push(payload);
    }
}
