import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerStuffStateLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleFurnitureAnimationChange(roomFurniture: RoomFurniture): Promise<void> {
        this.handleExecution({ roomFurniture });
    }

    public shouldTrigger(options?: WiredTriggerOptions): boolean {
        if(!options?.roomFurniture) {
            return false;
        }

        if(this.roomFurniture.model.data?.wiredTriggerStuffState?.selection?.furnitureSource === "list" && this.roomFurniture.model.data?.wiredTriggerStuffState.selection?.furnitureIds.length) {
            const index = this.roomFurniture.model.data.wiredTriggerStuffState.selection?.furnitureIds.indexOf(options.roomFurniture.model.id);

            if(index !== -1) {
                if(this.roomFurniture.model.data.wiredTriggerStuffState.trigger === "all") {
                    return true;
                }
                else if(this.roomFurniture.model.data.wiredTriggerStuffState.trigger === "state") {
                    const expectedState = this.roomFurniture.model.data.wiredTriggerStuffState.furnitureTriggerStates.at(index);

                    if(expectedState !== undefined) {
                        if(options.roomFurniture.model.animation === expectedState) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
}
