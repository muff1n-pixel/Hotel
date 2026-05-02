import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomUserFrozenEffect } from "../../../../Users/Interfaces/RoomUserFrozenEffect";
import { HotelAlertData, RoomActorChatData } from "@pixel63/events";

export default class WiredActionKickUserLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!options?.roomUser) {
            return;
        }

        await this.setActive();

        if(options.roomUser.user.model.id === this.roomFurniture.room.model.owner.id) {
            options.roomUser.user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                actor: {
                    user: {
                        userId: options.roomUser.user.model.id
                    }
                },

                message: "Wired Action Kick User: Room owner cannot be kicked.",
                roomChatStyleId: "notification",
                options: {
                    hideUsername: true
                }
            }));

            return;
        }

        options.roomUser.disconnect();

        options.roomUser.user.sendProtobuff(HotelAlertData, HotelAlertData.create({
            message: "You were kicked by a Wired Action: " + (this.roomFurniture.model.data?.wiredActionKickUser?.message ?? "No message provided."),
        }));
    }
}
