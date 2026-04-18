import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerClockCounterLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleClockCounter(roomFurniture: RoomFurniture, seconds: number) {
        console.log(`Handling clock counter for furniture ${roomFurniture.model.id} with ${seconds} seconds.`);
        
        if(!this.roomFurniture.model.data?.wiredTriggerClockCounter?.selection?.furnitureIds.includes(roomFurniture.model.id)) {
            return;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if(this.roomFurniture.model.data?.wiredTriggerClockCounter?.minute === minutes && this.roomFurniture.model.data?.wiredTriggerClockCounter?.second === remainingSeconds) {
            await this.setActive();
            
            await this.handleTrigger({ roomFurniture });
        }
    }
}
