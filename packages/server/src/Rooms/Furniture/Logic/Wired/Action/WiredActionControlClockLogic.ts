import { RoomPositionOffsetData } from "@pixel63/events";
import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import RoomFurnitureGameTimerLogic from "../../Games/RoomFurnitureGameTimerLogic";

export default class WiredActionControlClockLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionControlClock) {
            return;
        }

        let executed = false;

        for(const furnitureId of this.roomFurniture.model.data.wiredActionControlClock.furnitureIds) {
            const roomFurniture = this.roomFurniture.room.furnitures.find((roomFurniture) => roomFurniture.model.id === furnitureId);

            if(!roomFurniture) {
                continue;
            }

            if(!(roomFurniture.logic instanceof RoomFurnitureGameTimerLogic)) {
                continue;
            }

            executed = true;

            switch(this.roomFurniture.model.data.wiredActionControlClock.action) {
                case "start": {
                    await roomFurniture.logic.start();
                    
                    break;
                }

                case "stop": {
                    await roomFurniture.logic.stop();
                    
                    break;
                }

                case "pause": {
                    await roomFurniture.logic.pause();
                    
                    break;
                }

                case "resume": {
                    await roomFurniture.logic.resume();
                    
                    break;
                }

                case "reset": {
                    await roomFurniture.logic.reset();
                    
                    break;
                }
            }
        }

        if(executed) {
            await this.setActive();
        }
    }
}
