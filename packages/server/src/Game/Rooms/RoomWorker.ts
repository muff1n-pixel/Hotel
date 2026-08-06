import { ConnectToRoomData, ServerAddUserToRoomData, ServerReadyData, ServerRoomData, ServerRoomsData, ServerUserInventoryRefreshData, ServerUserInventoryUpdatedData } from "@pixel63/events";
import RoomWorkerWebSocket from "./RoomWorkerWebSocket";
import Game from "../Game";
import User from "../Users/User";
import UserRoomConnection from "../Users/Rooms/UserRoomConnection";
import ServerRoomsEvent from "../Events/Room/ServerRoomsEvent";
import ServerUserInventoryUpdatedEvent from "../Events/Room/ServerUserInventoryUpdatedEvent";
import ServerUserInventoryRefreshEvent from "../Events/Room/ServerUserInventoryRefreshEvent";

export default class RoomWorker {
    public readonly client: RoomWorkerWebSocket;
    public rooms: ServerRoomData[] = [];

    constructor(private game: Game, host: string, public readonly port: number, onOpen?: () => void) {
        this.client = new RoomWorkerWebSocket(this, game, host, port, onOpen);
    
        this.client.eventHandler.addProtobuffListener(ServerReadyData, {
            async handle(user, payload) {
                onOpen?.();
            },
        });
        
        this.client.eventHandler.addProtobuffListener(ServerRoomsData, new ServerRoomsEvent());
        this.client.eventHandler.addProtobuffListener(ServerUserInventoryUpdatedData, new ServerUserInventoryUpdatedEvent());
        this.client.eventHandler.addProtobuffListener(ServerUserInventoryRefreshData, new ServerUserInventoryRefreshEvent());
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
