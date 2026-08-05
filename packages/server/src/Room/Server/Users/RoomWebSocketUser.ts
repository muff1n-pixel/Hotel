import WebSocket from "ws";
import { UserModel } from "../../../Database/Models/Users/UserModel";
import UserPermissions from "../../../Game/Users/Permissions/UserPermissions";
import RoomUser from "../../Rooms/Users/RoomUser";
import RoomServer from "../RoomServer";
import RoomWebSocketServer from "../WebSocket/RoomWebSocketServer";
import { MessageType, UnknownMessage } from "@pixel63/events";

export default class RoomWebSocketUser {
    public readonly id = "";

    public readonly roomUser: RoomUser = 0 as any;
    public roomChatStyleId: string = "";

    public readonly permissions: UserPermissions;

    constructor(private readonly server: RoomServer, private readonly websocket: WebSocket, user: UserModel) {
        this.permissions = new UserPermissions(user);
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        this.server.websocket.sendProtobuff(this.websocket, message, payload);
    }

    public async getUser() {
        const user = await UserModel.findByPk(this.id);

        if(!user) {
            throw new Error("Failed to find user?");
        }

        return user;
    }
}
