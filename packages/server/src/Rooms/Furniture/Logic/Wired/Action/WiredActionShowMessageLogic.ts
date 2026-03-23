import RoomFurniture from "../../../RoomFurniture";
import WiredActionLogic from "../WiredActionLogic";
import { WiredTriggerOptions } from "../WiredLogic";
import { RoomActorChatData } from "@pixel63/events";

export type DelayedMessageData = {
    userId: string;
    timestamp: number;
};

export default class WiredActionShowMessageLogic extends WiredActionLogic {
    private messages: DelayedMessageData[] = [];
    
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleActionsInterval(): Promise<void> {
        await super.handleActionsInterval();
        
        if(!this.roomFurniture.model.data?.wiredActionShowMessage) {
            return;
        }
        
        for(const message of this.messages) {
            const elapsed = performance.now() - message.timestamp;

            if(elapsed < this.roomFurniture.model.data.wiredActionShowMessage.delayInSeconds * 1000) {
                continue;
            }

            const roomUser = this.roomFurniture.room.users.find((user) => user.user.model.id === message.userId);

            if(!roomUser) {
                this.messages.splice(this.messages.indexOf(message), 1);

                continue;
            }

            await this.setActive();

            roomUser.user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                actor: {
                    user: {
                        userId: roomUser.user.model.id
                    }
                },

                message: this.roomFurniture.model.data.wiredActionShowMessage.message,
                roomChatStyleId: "notification",
                options: {
                    hideUsername: true
                }
            }));

            this.messages.splice(this.messages.indexOf(message), 1);
        }
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(options?.roomUser) {
            if(this.roomFurniture.model.data?.wiredActionShowMessage?.message.length) {
                this.messages.push({
                    userId: options.roomUser.user.model.id,
                    timestamp: performance.now()
                });
            }
        }
    }
}