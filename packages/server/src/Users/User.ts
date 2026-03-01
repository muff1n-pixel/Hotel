import type WebSocket from "ws";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { EventEmitter } from "node:events";
import UserInventory from "./Inventory/UserInventory.js";
import Room from "../Rooms/Room.js";
import { debugTimestamps } from "../Database/Database.js";
import UserPermissions from "./Permissions/UserPermissions.js";
import { MessageType, UnknownMessage, UserData, UserPermissionsData } from "@pixel63/events";

export default class User extends EventEmitter {
    private inventory?: UserInventory;
    private permissions?: UserPermissions;
    public room?: Room;

    constructor(public readonly webSocket: WebSocket, public readonly model: UserModel) {
        super();
        
        this.getPermissions().then((permissions) => {
            this.sendProtobuff(UserPermissionsData, UserPermissionsData.create({
                permissions: permissions.getPermissionData()
            }));
        });
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        try {
            const encoded = message.encode(payload).finish();

            this.sendEncodedProtobuff(message.$type, encoded);
        }
        catch(error) {
            console.error("Failed to send Protobuff", error);
        }
    }

    sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        try {
            const typeBytes = new TextEncoder().encode(eventType + "|");

            const message = new Uint8Array(typeBytes.length + encoded.length);

            message.set(typeBytes, 0);
            message.set(encoded, typeBytes.length);

            this.webSocket.send(message);
        }
        catch(error) {
            console.error("Failed to send encoded Protobuff", error);
        }
    }

    addListener<T>(eventName: string | symbol, listener: (client: User, event: T) => void): this {
        return super.addListener(eventName, listener);
    }

    public getInventory() {
        if(!this.inventory) {
            this.inventory = new UserInventory(this);
        }

        return this.inventory;
    }

    public async getPermissions() {
        if(!this.permissions) {
            this.permissions = new UserPermissions(this);

            await this.permissions.loadPermissions();
        }

        return this.permissions;
    }

    public sendUserData() {
        this.sendProtobuff(UserData, UserData.fromJSON(this.model));
    }
}
