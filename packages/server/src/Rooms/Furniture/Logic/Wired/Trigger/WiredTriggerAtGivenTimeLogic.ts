import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerAtGivenTimeLogic extends WiredTriggerLogic {
    private hasTriggered: boolean = false;
    private readyAtTimestamp: number = performance.now();

    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }
    
    public handleDataChanged(): void {
        this.reset();
    }

    public reset(): void {
        this.readyAtTimestamp = performance.now();
        this.hasTriggered = false;
    }

    public async handleActionsInterval(): Promise<void> {
        await super.handleActionsInterval();

        if(this.hasTriggered) {
            return;
        }

        if(!this.roomFurniture.model.data?.wiredTriggerAtSetTime?.seconds) {
            return;
        }

        if(performance.now() < this.readyAtTimestamp + (this.roomFurniture.model.data.wiredTriggerAtSetTime.seconds * 1000)) {
            return;
        }

        this.hasTriggered = true;

        await this.setActive();
            
        await this.handleTrigger();
    }
}
