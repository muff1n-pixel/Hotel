import { ServerAddUserToRoomData, ServerRoomData } from "@pixel63/events";
import RoomServerClient from "./RoomServerClient";
import Game from "../Game";

export default class RoomServer {
    public readonly client: RoomServerClient;
    public readonly rooms: ServerRoomData[] = [];

    constructor(private game: Game, host: string, port: number) {
        this.client = new RoomServerClient(game, host, port);
    }

    public addUserToRoom(userId: string, roomId: string) {
        const room = this.rooms.find((room) => room.roomId === roomId);

        if(!room) {
            throw new Error("Room does not exist in client.");
        }

        this.client.sendProtobuff(ServerAddUserToRoomData, ServerAddUserToRoomData.create({
            userId,
            roomId
        }));
    }
}
