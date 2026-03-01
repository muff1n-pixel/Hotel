import RoomFurniture from "../../../RoomFurniture";
import WiredLogic, { WiredTriggerOptions } from "../WiredLogic";
import { WiredFurnitureSelectionData } from "@shared/Interfaces/Room/Furniture/Wired/WiredFurnitureSelectionData";
import WiredTriggerReceiveSignalLogic from "../Trigger/WiredTriggerReceiveSignalLogic";

export default class WiredActionSendSignalLogic extends WiredLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleTrigger(options?: WiredTriggerOptions): Promise<void> {
        for(const logic of this.roomFurniture.room.getFurnitureWithCategory(WiredTriggerReceiveSignalLogic)) {
            await logic.handleWiredSignal(this.roomFurniture, options);
        }

        return super.handleTrigger(options);
    }
}