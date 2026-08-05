import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
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

        this.handleExecution();
    }

    public shouldTrigger(options?: WiredTriggerOptions): boolean {
        if(this.hasTriggered) {
            return false;
        }

        if(!this.roomFurniture.model.data?.wiredTriggerAtSetTime?.seconds) {
            return false;
        }

        if(performance.now() < this.readyAtTimestamp + (this.roomFurniture.model.data.wiredTriggerAtSetTime.seconds * 1000)) {
            return false;
        }

        return true;
    }

    public handleTrigger(options?: WiredTriggerOptions): Promise<void> {
        this.hasTriggered = true;

        return super.handleTrigger(options);
    }
}
