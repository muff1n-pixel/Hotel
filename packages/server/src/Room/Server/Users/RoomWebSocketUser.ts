import WebSocket from "ws";
import { UserModel } from "../../../Database/Models/Users/UserModel";
import UserPermissions from "../../../Game/Users/Permissions/UserPermissions";
import RoomUser from "../../Rooms/Users/RoomUser";
import RoomServer from "../RoomServer";
import { LeaveRoomData, MessageType, ServerRoomData, ServerUserRemovedFromRoomData, UnknownMessage } from "@pixel63/events";
import RoomWebSocketUserAchievements from "./RoomWebSocketUserAchievements";
import Room from "../../Rooms/Room";
import { roomServer } from "../..";

export default class RoomWebSocketUser {
    public readonly id: string;

    public roomChatStyleId: string = "";

    public readonly permissions: UserPermissions;

    public readonly achievements = new RoomWebSocketUserAchievements(this);

    public readonly roomUser: RoomUser;

    constructor(private readonly server: RoomServer, private readonly websocket: WebSocket, public readonly model: UserModel, public readonly room: Room) {
        this.id = model.id;
        this.roomChatStyleId = model.roomChatStyleId;

        this.permissions = new UserPermissions(model);
        this.roomUser = room.addUserClient(this);
        
        roomServer.websocket.sendServerProtobuff(ServerRoomData, this.room.getServerData());
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        this.server.websocket.sendProtobuff(this.websocket, message, payload);
    }

    public sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        this.server.websocket.sendEncodedProtobuff(this.websocket, eventType, encoded);
    }

    public async getUser() {
        const user = await UserModel.findByPk(this.id);

        if(!user) {
            throw new Error("Failed to find user?");
        }

        return user;
    }

    public disconnect() {
        this.sendProtobuff(LeaveRoomData, LeaveRoomData.create({}));

        this.websocket.close();

        roomServer.websocket.sendServerProtobuff(ServerUserRemovedFromRoomData, ServerUserRemovedFromRoomData.create({
            userId: this.model.id,
            roomId: this.room.model.id
        }));

        roomServer.websocket.sendServerProtobuff(ServerRoomData, this.room.getServerData());

        this.server.roomManager.unloadRoom(this.room);
    }
}
