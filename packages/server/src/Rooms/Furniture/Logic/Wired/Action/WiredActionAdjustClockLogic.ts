import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import RoomFurnitureGameTimerLogic from "../../Games/RoomFurnitureGameTimerLogic";

export default class WiredActionAdjustClockLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionAdjustClock) {
            return;
        }

        let executed = false;

        const seconds = ((this.roomFurniture.model.data.wiredActionAdjustClock.minutes ?? 0) * 60) + (this.roomFurniture.model.data.wiredActionAdjustClock.seconds ?? 0);

        for(const furnitureId of this.roomFurniture.model.data.wiredActionAdjustClock.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(!(roomFurniture.logic instanceof RoomFurnitureGameTimerLogic)) {
                continue;
            }

            executed = true;

            switch(this.roomFurniture.model.data.wiredActionAdjustClock.action) {
                case "increase": {
                    await roomFurniture.logic.increase(seconds);
                    
                    break;
                }

                case "decrease": {
                    await roomFurniture.logic.decrease(seconds);
                    
                    break;
                }

                case "set": {
                    await roomFurniture.logic.set(seconds);
                    
                    break;
                }
            }
        }

        if(executed) {
            await this.setActive();
        }
    }
}
