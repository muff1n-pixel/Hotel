import RoomFurniture from "../../../RoomFurniture";
import WiredLogic, { WiredTriggerOptions } from "../WiredLogic";
import WiredTriggerReceiveSignalLogic from "../Trigger/WiredTriggerReceiveSignalLogic";

export default class WiredActionSendSignalLogic extends WiredLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleTrigger(options?: WiredTriggerOptions): Promise<void> {
        if(performance.now() - this.lastTriggered < 500) {
            return;
        }

        this.setActive();

        for(const logic of this.roomFurniture.room.getFurnitureWithCategory(WiredTriggerReceiveSignalLogic)) {
            await logic.handleWiredSignal(this.roomFurniture, options);
        }

        return super.handleTrigger(options);
    }
}