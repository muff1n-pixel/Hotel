import { RoomFurnitureHandleUserChatResult } from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import { WiredTriggerUserSaysSomethingData } from "@shared/Interfaces/Room/Furniture/Wired/Trigger/WiredTriggerUserSaysSomethingData";
import WiredLogic from "../WiredLogic";

export default class WiredTriggerUserSaysSomethingLogic extends WiredLogic {
    constructor(roomFurniture: RoomFurniture<WiredTriggerUserSaysSomethingData>) {
        super(roomFurniture);
    }

    public async handleUserChat(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult> {
        if(!this.roomFurniture.model.data) {
            return null;
        }

        if(this.roomFurniture.model.data.onlyRoomOwner) {
            if(roomUser.user.model.id !== roomUser.room.model.owner.id) {
                return null;
            }
        }

        if(!this.isMessageMatched(message)) {
            return null;
        }

        this.lastTriggered = performance.now();
        this.roomFurniture.setAnimation(101, true);

        this.handleTrigger();

        return {
            blockUserChat: this.roomFurniture.model.data.hideMessage === true
        };
    }

    private isMessageMatched(message: string) {
        switch(this.roomFurniture.model.data?.type) {
            case "keyword":
                return this.roomFurniture.model.data.message.length && message.toLowerCase().includes(this.roomFurniture.model.data.message.toLowerCase());

            case "match":
                return this.roomFurniture.model.data.message.length && message.toLowerCase() === this.roomFurniture.model.data.message.toLowerCase();

            case "match_all":
                return true;
        }

        return false;
    }
}