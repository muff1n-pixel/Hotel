import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomUserFrozenEffect } from "../../../../Users/Interfaces/RoomUserFrozenEffect";
import { HotelAlertData, RoomActorChatData } from "@pixel63/events";

export default class WiredActionGiveHanditemLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionGiveHanditem) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        await this.setActive();

        if(this.roomFurniture.model.data.wiredActionGiveHanditem.giveHanditemUsingBot) {
            const bot = this.roomFurniture.room.bots.find((bot) => bot.model.name.toLowerCase() === this.roomFurniture.model.data?.wiredActionGiveHanditem?.botName?.toLowerCase());

            if(!bot) {
                return;
            }

            bot.room.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                actor: {
                    bot: {
                        botId: bot.model.id
                    }
                },

                message: `*Gives ${options.roomUser.user.model.name} a hand item*`,
                roomChatStyleId: "bot_guide"
            }));
        }

        options.roomUser.addAction(`CarryItem.${this.roomFurniture.model.data.wiredActionGiveHanditem.handitem}`);
    }
}
