import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomBotsData } from "@pixel63/events";

export default class WiredActionBotChangeClothesLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionBotChangeClothes) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        await this.setActive();

        const bot = this.roomFurniture.room.bots.find((bot) => bot.model.name.toLowerCase() === this.roomFurniture.model.data?.wiredActionBotChangeClothes?.botName?.toLowerCase());

        if(!bot) {
            return;
        }

        await bot.model.update({
            figureConfiguration: this.roomFurniture.model.data.wiredActionBotChangeClothes.figureConfiguration
        });

        bot.room.sendProtobuff(RoomBotsData, RoomBotsData.fromJSON({
            botsUpdated: [
                {
                    ...bot.model,
                    position: bot.position,
                    direction: bot.direction
                }
            ]
        }));
    }
}
