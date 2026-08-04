import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import { WiredTriggerOptions } from "../WiredLogic";

export default class WiredTriggerReceiveSignalLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleWiredSignal(roomFurniture: RoomFurniture, options?: WiredTriggerOptions): Promise<void> {
        this.handleExecution(options);
    }

    public shouldTrigger(options?: WiredTriggerOptions): boolean {
        if(this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureSource !== "list") {
            return false;
        }
        
        const signalFurnitureId = this.roomFurniture.model.data.wiredFurnitureSelection?.furnitureIds.find((furnitureId) => options?.roomFurniture?.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && options?.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureIds.includes(furnitureId));
        
        if(!signalFurnitureId) {
            return false;
        }

        return true;
    }

    public handleTrigger(options?: WiredTriggerOptions, ...args: any[]): Promise<void> {
        const signalFurnitureId = this.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureIds.find((furnitureId) => options?.roomFurniture?.model.data?.wiredFurnitureSelection?.furnitureSource === "list" && options?.roomFurniture.model.data?.wiredFurnitureSelection?.furnitureIds.includes(furnitureId));
        
        if(!signalFurnitureId) {
            throw new Error("Signal furniture id does not exist.");
        }

        const roomFurniture = this.roomFurniture.room.getRoomFurniture(signalFurnitureId);

        return super.handleTrigger({ ...options, roomFurniture });
    }
}
