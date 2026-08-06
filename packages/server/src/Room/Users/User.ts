import WebSocket from "ws";
import { UserModel } from "../../Database/Models/Users/UserModel";
import UserPermissions from "../../Game/Users/Permissions/UserPermissions";
import RoomUser from "../Rooms/Users/RoomUser";
import RoomServer from "../RoomServer";
import { LeaveRoomData, MessageType, ServerRoomData, ServerRoomsData, ServerUserRemovedFromRoomData, ServerUserUpdatedData, UnknownMessage } from "@pixel63/events";
import UserAchievementsBridge from "./Achievements/UserAchievementsBridge";
import Room from "../Rooms/Room";

export default class User {
    public readonly achievements = new UserAchievementsBridge(this);

    public readonly roomUser: RoomUser;

    constructor(private readonly websocket: WebSocket, public readonly model: UserModel, public readonly room: Room, public readonly permissions: UserPermissions) {
        this.roomUser = room.addUserClient(this);
    }

    public async save() {
        await this.model.save();
        
        RoomServer.websocket.sendServerProtobuff(ServerUserUpdatedData, ServerUserUpdatedData.create({
            userId: this.model.id
        }));
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        RoomServer.websocket.sendProtobuff(this.websocket, message, payload);
    }

    public sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        RoomServer.websocket.sendEncodedProtobuff(this.websocket, eventType, encoded);
    }

    public async getUser() {
        const user = await UserModel.findByPk(this.model.id);

        if(!user) {
            throw new Error("Failed to find user?");
        }

        return user;
    }

    public disconnect() {
        this.sendProtobuff(LeaveRoomData, LeaveRoomData.create({}));

        this.websocket.close();
    }
}
