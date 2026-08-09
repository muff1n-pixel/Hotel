import { ServerRoomUnloadedData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";

export default class ServerRoomUnloadedEvent implements ServerProtobuffListener<ServerRoomUnloadedData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(server: RoomWorker, payload: ServerRoomUnloadedData) {
        game.roomWorkerPool.removeRoomData(payload.roomId);
    }
}
