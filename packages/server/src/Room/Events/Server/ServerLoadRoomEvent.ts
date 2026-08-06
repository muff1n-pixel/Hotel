import { ServerLoadRoomData, ServerRoomLoadedData, ServerRoomsData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServer from "../../RoomServer";

export default class ServerLoadRoomEvent implements ServerProtobuffListener<ServerLoadRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerLoadRoomData) {
        const room = await RoomServer.roomManager.loadRoomInstance(payload.roomId);

        if(!room) {
            throw new Error("Failed to load room.");
        }

        RoomServer.websocket.sendServerProtobuff(ServerRoomLoadedData, ServerRoomLoadedData.create({
            roomId: room.model.id,
            data: RoomServer.roomManager.instances.map((room) => room.getServerData())
        }));
    }
}
