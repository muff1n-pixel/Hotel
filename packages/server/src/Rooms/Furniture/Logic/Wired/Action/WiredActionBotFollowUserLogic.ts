import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";

export default class WiredActionBotFollowUserLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionBotFollowUser) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        await this.setActive();

        const bot = this.roomFurniture.room.bots.find((bot) => bot.model.name.toLowerCase() === this.roomFurniture.model.data?.wiredActionBotFollowUser?.botName?.toLowerCase());

        if(!bot) {
            return;
        }

        if(this.roomFurniture.model.data.wiredActionBotFollowUser.stopFollowing) {
            bot.stopFollowingUser(options.roomUser);
        }
        else {
            bot.setFollowingUser(options.roomUser);
        }
    }
}
