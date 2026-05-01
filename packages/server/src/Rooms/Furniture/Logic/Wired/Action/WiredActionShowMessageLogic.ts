import RoomFurniture from "../../../RoomFurniture";
import WiredActionLogic from "../WiredActionLogic";
import { WiredTriggerOptions } from "../WiredLogic";
import { RoomActorChatData } from "@pixel63/events";


export default class WiredActionShowMessageLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(this.roomFurniture.model.data?.wiredActionShowMessage?.message.length) {
            const roomUsers = this.getRoomUsersForMessage(options?.roomUser?.user.model.id);

            if(!roomUsers.length) {
                return;
            }

            await this.setActive();

            for(const roomUser of roomUsers) {
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
            }
        }
    }

    private getRoomUsersForMessage(userId: string | undefined) {
        if(!userId) {
            return this.roomFurniture.room.users;
        }

        return this.roomFurniture.room.users.filter((user) => user.user.model.id === userId);
    }
}