import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import WiredTriggerAtGivenTimeLogic from "../Trigger/WiredTriggerAtGivenTimeLogic";

export default class WiredActionResetTimersLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        const timerLogic = this.roomFurniture.room.getFurnitureWithCategory(WiredTriggerAtGivenTimeLogic);

        for(const logic of timerLogic) {
            logic.reset();
        }

        if(timerLogic.length) {
            await this.setActive();
        }
    }
}
