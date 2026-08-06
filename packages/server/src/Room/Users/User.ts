import WebSocket from "ws";
import { UserModel } from "../../Database/Models/Users/UserModel";
import UserPermissions from "../../Game/Users/Permissions/UserPermissions";
import RoomUser from "../Rooms/Users/RoomUser";
import RoomServer from "../RoomServer";
import { LeaveRoomData, MessageType, ServerRoomData, ServerRoomsData, ServerUserRemovedFromRoomData, UnknownMessage } from "@pixel63/events";
import UserAchievementsBridge from "./Achievements/UserAchievementsBridge";
import Room from "../Rooms/Room";

export default class User {
    public readonly id: string;

    public roomChatStyleId: string = "";

    public readonly permissions: UserPermissions;

    public readonly achievements = new UserAchievementsBridge(this);

    public readonly roomUser: RoomUser;

    constructor(private readonly websocket: WebSocket, public readonly model: UserModel, public readonly room: Room) {
        this.id = model.id;
        this.roomChatStyleId = model.roomChatStyleId;

        this.permissions = new UserPermissions(model);
        this.roomUser = room.addUserClient(this);

        RoomServer.websocket.sendServerProtobuff(ServerRoomsData, ServerRoomsData.create({
            data: RoomServer.roomManager.instances.map((room) => room.getServerData())
        }));
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        RoomServer.websocket.sendProtobuff(this.websocket, message, payload);
    }

    public sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        RoomServer.websocket.sendEncodedProtobuff(this.websocket, eventType, encoded);
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

        RoomServer.websocket.sendServerProtobuff(ServerUserRemovedFromRoomData, ServerUserRemovedFromRoomData.create({
            userId: this.model.id,
            roomId: this.room.model.id
        }));

        RoomServer.roomManager.unloadRoom(this.room);

        RoomServer.websocket.sendServerProtobuff(ServerRoomsData, ServerRoomsData.create({
            data: RoomServer.roomManager.instances.map((room) => room.getServerData())
        }));
    }
}
