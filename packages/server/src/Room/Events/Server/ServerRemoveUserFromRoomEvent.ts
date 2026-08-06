import { ServerLoadRoomData, ServerRemoveUserFromRoomData, ServerRoomLoadedData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServer from "../../RoomServer";
import { logger } from "../../RoomLogger";

export default class ServerRemoveUserFromRoomEvent implements ServerProtobuffListener<ServerRemoveUserFromRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerRemoveUserFromRoomData) {
        const user = RoomServer.users.find((user) => user.model.id === payload.userId);

        if(!user) {
            logger.warn("User to disconnect is not connected.");

            return;
        }

        user.disconnect();
    }
}
