import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerClockCounterLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleClockCounter(roomFurniture: RoomFurniture, seconds: number) {
        this.handleExecution({ roomFurniture }, seconds);
    }

    public shouldTrigger(options: WiredTriggerOptions, seconds?: number): boolean {
        if(!options.roomFurniture) {
            return false;
        }

        if(seconds === undefined) {
            return false;
        }

        if(!this.roomFurniture.model.data?.wiredTriggerClockCounter?.selection?.furnitureIds.includes(options.roomFurniture.model.id)) {
            return false;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if(this.roomFurniture.model.data?.wiredTriggerClockCounter?.minute !== minutes || this.roomFurniture.model.data?.wiredTriggerClockCounter?.second !== remainingSeconds) {
            return false;
        }

        return true;
    }
}
