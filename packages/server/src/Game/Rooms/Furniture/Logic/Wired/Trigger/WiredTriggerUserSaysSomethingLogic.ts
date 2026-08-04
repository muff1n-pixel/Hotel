import { RoomFurnitureHandleUserChatResult } from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import WiredTriggerLogic from "../WiredTriggerLogic";
import { WiredTriggerOptions } from "../WiredLogic";

export default class WiredTriggerUserSaysSomethingLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserChat(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult> {
        if(this.shouldTrigger({ roomUser }, message)) {
            this.handleExecution({ roomUser }, message);
            
            return {
                blockUserChat: this.roomFurniture.model.data?.wiredTriggerUserSaysSomething?.hideMessage === true
            };
        }

        return null;
    }

    public shouldTrigger(options?: WiredTriggerOptions, message?: string): boolean {
        if(!options?.roomUser) {
            return false;
        }

        if(!message) {
            return false;
        }

        if(!this.roomFurniture.model.data) {
            return false;
        }

        if(this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.onlyRoomOwner) {
            if(options.roomUser.user.model.id !== options.roomUser.room.model.owner.id) {
                return false;
            }
        }

        if(!this.isMessageMatched(message)) {
            return false;
        }

        return true;
    }

    private isMessageMatched(message: string) {
        switch(this.roomFurniture.model.data?.wiredTriggerUserSaysSomething?.type) {
            case "keyword":
                return this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.message.length && message.toLowerCase().includes(this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.message.toLowerCase());

            case "match":
                return this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.message.length && message.toLowerCase() === this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.message.toLowerCase();

            case "match_all":
                return true;
        }

        return false;
    }
}