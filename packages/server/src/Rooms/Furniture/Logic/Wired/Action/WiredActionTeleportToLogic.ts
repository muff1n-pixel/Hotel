import { RoomPositionOffsetData } from "@pixel63/events";
import RoomFurniture from "../../../RoomFurniture";
import WiredLogic, { WiredTriggerOptions } from "../WiredLogic";

export type DelayedMessageData = {
    userId: string;
    timestamp: number;
};

export default class WiredActionTeleportToLogic extends WiredLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleTrigger(options?: WiredTriggerOptions): Promise<void> {
        if(options?.roomUser) {
            if(this.roomFurniture.model.data?.wiredActionTeleportToFurniture?.furnitureIds.length) {
                const availableFurnitures = this.roomFurniture.room.furnitures.filter((furniture) => this.roomFurniture.model.data?.wiredActionTeleportToFurniture?.furnitureIds.includes(furniture.model.id));

                const randomFurniture = availableFurnitures[Math.floor(Math.random() * availableFurnitures.length)];

                if(randomFurniture) {
                    this.setActive();
                    
                    options.roomUser.path.teleportTo(RoomPositionOffsetData.fromJSON(randomFurniture.model.position));
                }
            }
        }

        return super.handleTrigger(options);
    }
}