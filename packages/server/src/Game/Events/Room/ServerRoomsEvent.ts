import { ServerRoomData, ServerRoomsData } from "@pixel63/events";
import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomWorkerWebSocket from "../../Rooms/RoomWorkerWebSocket";
import { game } from "../..";
import RoomWorker from "../../Rooms/RoomWorker";

export default class ServerRoomsEvent implements ServerProtobuffListener<ServerRoomsData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(server: RoomWorker, payload: ServerRoomsData) {
        server.rooms = payload.data;
    }
}
