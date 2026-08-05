import { ConnectToRoomData, ServerAddUserToRoomData, ServerRoomData } from "@pixel63/events";
import RoomServerClient from "./RoomServerClient";
import Game from "../Game";
import User from "../Users/User";

export default class RoomServer {
    public readonly client: RoomServerClient;
    public readonly rooms: ServerRoomData[] = [];

    constructor(private game: Game, host: string, port: number) {
        this.client = new RoomServerClient(game, host, port);
    }

    public addUserToRoom(user: User, roomId: string) {
        const room = this.rooms.find((room) => room.roomId === roomId);

        if(!room) {
            throw new Error("Room does not exist in client.");
        }

        this.client.sendProtobuff(ServerAddUserToRoomData, ServerAddUserToRoomData.create({
            userId: user.model.id,
            roomId
        }));

        user.sendProtobuff(ConnectToRoomData, ConnectToRoomData.create({
            host: this.client.host,
            port: this.client.port,
            roomId: roomId
        }));
    }
}
