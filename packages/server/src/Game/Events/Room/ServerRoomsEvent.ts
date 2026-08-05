import { ServerRoomData, ServerRoomsData } from "@pixel63/events";
import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServerClient from "../../Rooms/RoomServerClient";
import { game } from "../..";
import RoomServer from "../../Rooms/RoomServer";

export default class ServerRoomsEvent implements ServerProtobuffListener<ServerRoomsData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(server: RoomServer, payload: ServerRoomsData) {
        server.rooms = payload.data;
    }
}
