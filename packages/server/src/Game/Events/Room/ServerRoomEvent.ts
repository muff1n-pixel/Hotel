import { ServerRoomData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";

export default class ServerRoomEvent implements ServerProtobuffListener<ServerRoomData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(server: RoomWorker, payload: ServerRoomData) {
        game.roomWorkerPool.setRoomData(payload.roomId, payload);
    }
}
