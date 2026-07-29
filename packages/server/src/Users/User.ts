import type WebSocket from "ws";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { EventEmitter } from "node:events";
import UserInventory from "./Inventory/UserInventory.js";
import Room from "../Rooms/Room.js";
import UserPermissions from "./Permissions/UserPermissions.js";
import { MessageType, UnknownMessage, UserData, UserPermissionsData, WidgetNotificationData } from "@pixel63/events";
import UserFriends from "./Friends/UserFriends.js";
import UserAchievements from "./Achievements/UserAchievements.js";
import UserSpamProtection from "./SpamPrevention/UserSpamPrevention.js";

export default class User extends EventEmitter {
    private inventory?: UserInventory;
    public friends: UserFriends;
    public achievements: UserAchievements;
    public permissions: UserPermissions;

    public spamProtection: UserSpamProtection;
    
    public room?: Room;
    public roomBellQueue?: Room | undefined;

    constructor(public readonly webSocket: WebSocket, public readonly model: UserModel) {
        super();

        this.spamProtection = new UserSpamProtection(this);
        this.permissions = new UserPermissions(this);
        this.friends = new UserFriends(this);
        this.achievements = new UserAchievements(this.model.id);
        
        this.permissions.loadPermissions().then(() => {
            this.sendProtobuff(UserPermissionsData, UserPermissionsData.create({
                permissions: this.permissions.getPermissionData()
            }));
        }).catch(console.error);
    }

    public disconnect() {
        if(this.room) {
            const roomUser = this.room.getRoomUser(this);

            roomUser.disconnect();
        }

        this.webSocket.close();
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
        return this.permissions;
    }

    public sendUserData() {
        this.sendProtobuff(UserData, UserData.fromJSON(this.model));
    }
    
    public sendWidgetNotification(data: WidgetNotificationData) {
        this.sendProtobuff(WidgetNotificationData, data);
    }

    public hasMembership(membership: string) {
        switch(membership) {
            case "habboclub": {
                return this.model.habboClub && new Date(this.model.habboClub) >= new Date();
            }
        }

        return false;
    }
}
