import { RoomFurnitureHandleUserChatResult } from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import WiredLogic from "../WiredLogic";

export default class WiredTriggerUserSaysSomethingLogic extends WiredLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleUserChat(roomUser: RoomUser, message: string): Promise<RoomFurnitureHandleUserChatResult> {
        if(!this.roomFurniture.model.data) {
            return null;
        }

        if(this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.onlyRoomOwner) {
            if(roomUser.user.model.id !== roomUser.room.model.owner.id) {
                return null;
            }
        }

        if(!this.isMessageMatched(message)) {
            return null;
        }

        this.setActive();

        this.handleTrigger({
            roomUser
        });

        return {
            blockUserChat: this.roomFurniture.model.data.wiredTriggerUserSaysSomething?.hideMessage === true
        };
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