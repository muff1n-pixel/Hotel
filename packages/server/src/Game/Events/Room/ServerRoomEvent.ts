import { ServerRoomData } from "@pixel63/events";
import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServerClient from "../../Rooms/RoomServerClient";
import { game } from "../..";

export default class ServerRoomEvent implements ServerProtobuffListener<ServerRoomData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomServerClient, payload: ServerRoomData) {
        game.roomServers.updateRoomData(payload);
    }
}
