import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomActorChatData } from "@pixel63/events";

export default class WiredActionBotTalkLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionBotTalk) {
            return;
        }

        await this.setActive();

        const bot = this.roomFurniture.room.bots.find((bot) => bot.model.name.toLowerCase() === this.roomFurniture.model.data?.wiredActionBotTalk?.botName?.toLowerCase());

        if(!bot) {
            return;
        }

        bot.room.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
            actor: {
                bot: {
                    botId: bot.model.id
                }
            },

            message: this.roomFurniture.model.data.wiredActionBotTalk.message,
            roomChatStyleId: "bot_guide",
            options: {
                // TODO: add shout
            }
        }));
    }
}
