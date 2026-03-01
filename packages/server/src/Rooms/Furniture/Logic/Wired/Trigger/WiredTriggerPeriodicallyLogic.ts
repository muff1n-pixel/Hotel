import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";
import { WiredTriggerPeriodicallyData } from "@shared/Interfaces/Room/Furniture/Wired/Trigger/WiredTriggerPeriodicallyData";

export default class WiredTriggerPeriodicallyLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleActionsInterval(): Promise<void> {
        const elapsed = performance.now() - this.lastTriggered;
        
        if(elapsed >= (this.roomFurniture.model.data?.wiredTriggerPeriodically?.seconds ?? 5) * 1000) {
            this.setActive();
            
            this.handleTrigger();
        }

        super.handleActionsInterval();
    }
}
