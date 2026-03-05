import RoomFurniture from "../../../RoomFurniture.js";
import WiredTriggerLogic from "../WiredTriggerLogic.js";
import { WiredTriggerOptions } from "../WiredLogic.js";

export default class WiredTriggerReceiveSignalLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleWiredSignal(roomFurniture: RoomFurniture, options?: WiredTriggerOptions): Promise<void> {

        if(this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource === "list") {
            const signalFurnitureId = this.roomFurniture.model.data.wiredFurnitureSelection?.furnitureIds.find((furnitureId) => roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && roomFurniture.model.data?.wiredFurnitureSelection?.furnitureIds.includes(furnitureId));
            
            if(signalFurnitureId) {
                const signalFurniture = this.roomFurniture.room.getRoomFurniture(signalFurnitureId);

                this.setActive();
                this.handleTrigger({
                    ...options,
                    signalFurniture
                });
            }
        }
    }
}
