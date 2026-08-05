import { ServerLoadRoomData, ServerRoomLoadedData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { roomServer } from "../..";

export default class ServerLoadRoomEvent implements ServerProtobuffListener<ServerLoadRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerLoadRoomData) {
        const room = await roomServer.roomManager.loadRoomInstance(payload.roomId);

        if(!room) {
            throw new Error("Failed to load room.");
        }

        roomServer.websocket.sendServerProtobuff(ServerRoomLoadedData, ServerRoomLoadedData.create({
            roomId: room.model.id,
            data: room.getServerData()
        }));
    }
}
