import RoomFurniture from "../../../RoomFurniture.js";
import WiredLogic, { WiredTriggerOptions } from "../WiredLogic.js";
import WiredTriggerReceiveSignalLogic from "../Trigger/WiredTriggerReceiveSignalLogic.js";

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