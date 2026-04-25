import { RoomPositionOffsetData } from "@pixel63/events";
import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";

export type DelayedMessageData = {
    userId: string;
    timestamp: number;
};

export default class WiredActionToggleStateLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionToggleState) {
            return;
        }

        const availableFurnitures = this.roomFurniture.room.furnitures.filter((furniture) => this.roomFurniture.model.data?.wiredActionToggleState?.furnitureIds.includes(furniture.model.id));

        for(const furniture of availableFurnitures) {
            const nextAnimation = (this.roomFurniture.model.data.wiredActionToggleState.toggleType === "next")?(furniture.getNextAnimation()):(furniture.getPreviousAnimation());

            if(nextAnimation !== null) {
                furniture.setAnimation(nextAnimation).catch(console.error);
            }
        }

        if(availableFurnitures.length > 0) {
            await this.setActive();
        }
    }
}
