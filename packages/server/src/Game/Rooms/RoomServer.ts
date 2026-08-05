import { ConnectToRoomData, ServerAddUserToRoomData, ServerRoomData, ServerUserInventoryUpdatedData } from "@pixel63/events";
import RoomServerClient from "./RoomServerClient";
import Game from "../Game";
import User from "../Users/User";
import UserRoomConnection from "../Users/Rooms/UserRoomConnection";
import ServerRoomEvent from "../Events/Room/ServerRoomEvent";
import ServerUserInventoryUpdatedEvent from "../Events/Room/ServerUserInventoryUpdatedEvent";

export default class RoomServer {
    public readonly client: RoomServerClient;
    public readonly rooms: ServerRoomData[] = [];

    constructor(private game: Game, host: string, port: number) {
        this.client = new RoomServerClient(game, host, port);
    
        this.client.eventHandler.addProtobuffListener(ServerRoomData, new ServerRoomEvent());
        this.client.eventHandler.addProtobuffListener(ServerUserInventoryUpdatedData, new ServerUserInventoryUpdatedEvent());
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

        user.room = new UserRoomConnection(user, this.client, roomId);
    }
}
