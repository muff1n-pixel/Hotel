import type WebSocket from "ws";
import { UserModel } from "../../Database/Models/Users/UserModel.js";
import { EventEmitter } from "node:events";
import UserInventory from "./Inventory/UserInventory.js";
import UserPermissions from "./Permissions/UserPermissions.js";
import { MessageType, ServerUserUpdatedData, UnknownMessage, UserData, UserPermissionsData, WidgetNotificationData } from "@pixel63/events";
import UserFriends from "./Friends/UserFriends.js";
import UserAchievements from "./Achievements/UserAchievements.js";
import UserSpamProtection from "./SpamPrevention/UserSpamPrevention.js";
import UserHabboClub from "./HabboClub/UserHabboClub.js";
import UserRoomConnection from "./Rooms/UserRoomConnection.js";
import UserRoomQueue from "./Rooms/UserRoomQueue.js";
import { game } from "../index.js";

export default class User extends EventEmitter {
    private inventory?: UserInventory;
    public friends: UserFriends;
    public achievements: UserAchievements;
    public permissions: UserPermissions;

    public habboClub: UserHabboClub;

    public spamProtection: UserSpamProtection;
    
    public room: UserRoomConnection | undefined = undefined;
    public roomBellQueue?: UserRoomQueue | undefined;

    public activityRewards: Map<string, number> = new Map();
    public readonly loggedInAt = performance.now();

    constructor(public readonly webSocket: WebSocket, public readonly model: UserModel) {
        super();

        this.spamProtection = new UserSpamProtection(this);
        this.permissions = new UserPermissions(this.model);
        this.friends = new UserFriends(this);
        this.achievements = new UserAchievements(this.model.id);
        this.habboClub = new UserHabboClub(this);
        
        this.permissions.loadPermissions().then(() => {
            this.sendProtobuff(UserPermissionsData, UserPermissionsData.create({
                permissions: this.permissions.getPermissionData()
            }));
        }).catch(console.error);
    }

    public async save() {
        await this.model.save();

        if(this.room) {
            this.room.client.sendProtobuff(ServerUserUpdatedData, ServerUserUpdatedData.create({
                userId: this.model.id
            }));
        }

        this.sendUserData();
    }

    public disconnect() {
        this.webSocket.close();
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        game.webSocket.sendProtobuff(this.webSocket, message, payload);
    }

    sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        game.webSocket.sendEncodedProtobuff(this.webSocket, eventType, encoded);
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
                return this.habboClub.isActive();
            }
        }

        return false;
    }

    public async resetScratches() {
        if(!this.model.scratchesResetAt || Date.now() - this.model.scratchesResetAt.getTime() > 24 * 60 * 60 * 1000) {
            this.model.scratchesResetAt = new Date();
            this.model.scratches = 3;

            await this.save();
        }
    }
}
