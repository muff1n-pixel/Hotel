import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomPositionOffsetData } from "@pixel63/events";

export default class WiredActionBotTeleportToFurniLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionBotTeleportToFurni) {
            return;
        }

        if(!this.roomFurniture.model.data.common?.furnitureSelection?.furnitureIds) {
            return;
        }

        await this.setActive();

        const bot = this.roomFurniture.room.bots.find((bot) => bot.model.name.toLowerCase() === this.roomFurniture.model.data?.wiredActionBotTeleportToFurni?.botName?.toLowerCase());

        if(!bot) {
            return;
        }

        const targetFurnitureId = this.roomFurniture.model.data.common.furnitureSelection.furnitureIds[Math.floor(Math.random() * this.roomFurniture.model.data.common.furnitureSelection.furnitureIds.length)];

        if(!targetFurnitureId) {
            return;
        }

        const targetFurniture = this.roomFurniture.room.furnitures.find((furniture) => furniture.model.id === targetFurnitureId);

        if(!targetFurniture) {
            return;
        }

        bot.path.teleportTo(RoomPositionOffsetData.fromJSON(targetFurniture.model.position), true);
    }
}
