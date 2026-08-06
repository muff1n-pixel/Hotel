import { ConnectToRoomData, ServerAddUserAchievementScoreData, ServerAddUserToRoomData, ServerReadyData, ServerRemoveUserToRoomQueueData, ServerRoomData, ServerRoomsData, ServerSetUserAchievementScoreData, ServerTransferUserToRoomData, ServerUpdateUserRoomQueueData, ServerUserInventoryRefreshData, ServerUserInventoryUpdatedData, ServerUserUpdatedData } from "@pixel63/events";
import RoomWorkerWebSocket from "./RoomWorkerWebSocket";
import Game from "../Game";
import User from "../Users/User";
import UserRoomConnection from "../Users/Rooms/UserRoomConnection";
import ServerRoomsEvent from "../Events/Room/ServerRoomsEvent";
import ServerUserInventoryUpdatedEvent from "../Events/Room/ServerUserInventoryUpdatedEvent";
import ServerUserInventoryRefreshEvent from "../Events/Room/ServerUserInventoryRefreshEvent";
import ServerUserUpdatedEvent from "../Events/Room/ServerUserUpdatedEvent";
import ServerAddUserAchievementScoreEvent from "../Events/Room/ServerAddUserAchievementScoreEvent";
import ServerSetUserAchievementScoreEvent from "../Events/Room/ServerSetUserAchievementScoreEvent";
import ServerUpdateUserRoomQueueEvent from "../Events/Room/ServerUpdateUserRoomQueueEvent";
import ServerRemoveUserFromRoomQueueEvent from "../Events/Room/ServerRemoveUserFromRoomQueueEvent";
import ServerTransferUserToRoomEvent from "../Events/Room/ServerTransferUserToRoomEvent";

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
        this.client.eventHandler.addProtobuffListener(ServerUserUpdatedData, new ServerUserUpdatedEvent());
        this.client.eventHandler.addProtobuffListener(ServerUserInventoryUpdatedData, new ServerUserInventoryUpdatedEvent());
        this.client.eventHandler.addProtobuffListener(ServerUserInventoryRefreshData, new ServerUserInventoryRefreshEvent());

        this.client.eventHandler.addProtobuffListener(ServerAddUserAchievementScoreData, new ServerAddUserAchievementScoreEvent());
        this.client.eventHandler.addProtobuffListener(ServerSetUserAchievementScoreData, new ServerSetUserAchievementScoreEvent());

        this.client.eventHandler.addProtobuffListener(ServerUpdateUserRoomQueueData, new ServerUpdateUserRoomQueueEvent());
        this.client.eventHandler.addProtobuffListener(ServerRemoveUserToRoomQueueData, new ServerRemoveUserFromRoomQueueEvent());
        
        this.client.eventHandler.addProtobuffListener(ServerTransferUserToRoomData, new ServerTransferUserToRoomEvent());
    }

    public addUserToRoom(user: User, roomId: string, userFurnitureId?: string) {
        const room = this.rooms.find((room) => room.roomId === roomId);

        if(!room) {
            throw new Error("Room does not exist in client.");
        }

        this.client.sendProtobuff(ServerAddUserToRoomData, ServerAddUserToRoomData.create({
            userId: user.model.id,
            roomId,
            userFurnitureId
        }));

        user.sendProtobuff(ConnectToRoomData, ConnectToRoomData.create({
            host: this.client.host,
            port: this.client.port,
            roomId: roomId
        }));

        user.room = new UserRoomConnection(user, this.client, roomId);

        user.friends.updateFriends();
    }
}
