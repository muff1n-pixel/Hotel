import RoomFurniture from "../../../RoomFurniture";
import RoomUser from "../../../../Users/RoomUser";
import WiredLogic from "../WiredLogic";
import { WiredActionShowMessageData } from "@shared/Interfaces/Room/Furniture/Wired/Action/WiredActionShowMessageData";
import OutgoingEvent from "../../../../../Events/Interfaces/OutgoingEvent";
import { RoomChatEventData } from "@shared/Communications/Responses/Rooms/Chat/RoomChatEventData";

export type DelayedMessageData = {
    userId: string;
    timestamp: number;
};

export default class WiredActionShowMessageLogic extends WiredLogic<WiredActionShowMessageData> {
    private messages: DelayedMessageData[] = [];
    
    constructor(roomFurniture: RoomFurniture<WiredActionShowMessageData>) {
        super(roomFurniture);
    }

    public async handleActionsInterval(): Promise<void> {
        super.handleActionsInterval();
        
        if(!this.roomFurniture.model.data) {
            return;
        }
        
        for(const message of this.messages) {
            const elapsed = performance.now() - message.timestamp;

            if(elapsed < this.roomFurniture.model.data.delayInSeconds * 1000) {
                continue;
            }

            const roomUser = this.roomFurniture.room.users.find((user) => user.user.model.id === message.userId);

            if(!roomUser) {
                this.messages.splice(this.messages.indexOf(message), 1);

                continue;
            }

            this.lastTriggered = performance.now();
            
            if(this.roomFurniture.model.animation !== 101) {
                this.roomFurniture.setAnimation(101);
            }

            roomUser.user.send(new OutgoingEvent<RoomChatEventData>("RoomChatEvent", {
                type: "user",
                userId: roomUser.user.model.id,
                message: this.roomFurniture.model.data.message,
                roomChatStyleId: "notification",
                options: {
                    hideUsername: true
                }
            }));

            this.messages.splice(this.messages.indexOf(message), 1);
        }
    }

    public async handleTrigger(roomUser?: RoomUser): Promise<void> {
        if(roomUser) {
            if(this.roomFurniture.model.data?.message.length) {
                this.messages.push({
                    userId: roomUser.user.model.id,
                    timestamp: performance.now()
                });
            }
        }

        return super.handleTrigger(roomUser);
    }
}